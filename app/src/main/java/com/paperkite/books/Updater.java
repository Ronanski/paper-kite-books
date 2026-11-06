package com.paperkite.books;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageInstaller;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Looks for a newer APK on the app's GitHub Releases page, downloads it, and installs it when the
 * app is not on screen, so nobody is interrupted while making or reading a book.
 */
class Updater {
    private static final String RELEASES = "https://api.github.com/repos/Ronanski/paper-kite-books/releases?per_page=5";
    private static final String DOWNLOADS = "https://github.com/Ronanski/paper-kite-books/releases/download/";
    private static final Pattern APK = Pattern.compile(".*-build(\\d+)\\.apk");
    private static final String DONE = "com.paperkite.books.INSTALL_DONE";

    private final Activity activity;
    private final File dir;
    private volatile File ready;
    private volatile Intent confirm;
    private volatile boolean visible;
    private boolean installing;
    private boolean askedPermission;

    Updater(Activity activity) {
        this.activity = activity;
        dir = new File(activity.getCacheDir(), "update");
        dir.mkdirs();
        BroadcastReceiver done = new BroadcastReceiver() {
            @Override
            public void onReceive(Context c, Intent i) {
                int status = i.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE);
                if (status == PackageInstaller.STATUS_PENDING_USER_ACTION) {
                    confirm = i.getParcelableExtra(Intent.EXTRA_INTENT);
                    showConfirm();
                } else if (status != PackageInstaller.STATUS_SUCCESS) {
                    installing = false;
                }
            }
        };
        IntentFilter filter = new IntentFilter(DONE);
        Context app = activity.getApplicationContext();
        if (Build.VERSION.SDK_INT >= 33) app.registerReceiver(done, filter, Context.RECEIVER_NOT_EXPORTED);
        else app.registerReceiver(done, filter);
    }

    private int currentBuild() throws Exception {
        return activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0).versionCode;
    }

    void check() {
        new Thread(() -> {
            try {
                int best = currentBuild();
                String url = null;
                long size = 0;
                JSONArray releases = new JSONArray(readText(RELEASES));
                for (int r = 0; r < releases.length(); r++) {
                    JSONObject rel = releases.getJSONObject(r);
                    if (rel.optBoolean("draft")) continue;
                    JSONArray assets = rel.getJSONArray("assets");
                    for (int a = 0; a < assets.length(); a++) {
                        JSONObject asset = assets.getJSONObject(a);
                        Matcher m = APK.matcher(asset.getString("name"));
                        String link = asset.getString("browser_download_url");
                        if (!m.matches() || !link.startsWith(DOWNLOADS)) continue;
                        int build = Integer.parseInt(m.group(1));
                        if (build > best) {
                            best = build;
                            url = link;
                            size = asset.getLong("size");
                        }
                    }
                }
                if (url == null) {
                    clear(null);
                    return;
                }
                File apk = new File(dir, "build" + best + ".apk");
                if (apk.length() != size) download(url, apk, size);
                clear(apk);
                ready = apk;
                askPermissionOnce();
            } catch (Exception ignored) {
                // No internet or GitHub is busy: try again next time the app opens.
            }
        }).start();
    }

    private void clear(File keep) {
        File[] old = dir.listFiles();
        if (old != null) for (File f : old) if (!f.equals(keep)) f.delete();
    }

    private static HttpURLConnection open(String url) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(15000);
        c.setReadTimeout(30000);
        c.setRequestProperty("User-Agent", "PaperKiteBooks");
        return c;
    }

    private static String readText(String url) throws Exception {
        HttpURLConnection c = open(url);
        c.setRequestProperty("Accept", "application/vnd.github+json");
        try (InputStream in = c.getInputStream(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            copy(in, out);
            return new String(out.toByteArray(), StandardCharsets.UTF_8);
        } finally {
            c.disconnect();
        }
    }

    private void download(String url, File apk, long size) throws Exception {
        File tmp = new File(dir, "download.tmp");
        HttpURLConnection c = open(url);
        try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(tmp)) {
            copy(in, out);
        } finally {
            c.disconnect();
        }
        if (tmp.length() != size || !tmp.renameTo(apk)) {
            tmp.delete();
            throw new Exception("Incomplete download");
        }
    }

    private static void copy(InputStream in, OutputStream out) throws Exception {
        byte[] buf = new byte[65536];
        for (int n; (n = in.read(buf)) > 0; ) out.write(buf, 0, n);
    }

    private void askPermissionOnce() {
        if (askedPermission || activity.getPackageManager().canRequestPackageInstalls()) return;
        askedPermission = true;
        Intent i = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + activity.getPackageName()));
        activity.runOnUiThread(() -> { if (visible) activity.startActivity(i); });
    }

    void onShown() {
        visible = true;
        showConfirm();
    }

    /** The app has left the screen: a safe moment to install. */
    void onHidden() {
        visible = false;
        File apk = ready;
        if (apk == null || installing || !activity.getPackageManager().canRequestPackageInstalls()) return;
        installing = true;
        new Thread(() -> {
            try {
                install(apk);
            } catch (Exception e) {
                installing = false;
            }
        }).start();
    }

    private void install(File apk) throws Exception {
        PackageInstaller installer = activity.getPackageManager().getPackageInstaller();
        PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
        if (Build.VERSION.SDK_INT >= 31) params.setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_NOT_REQUIRED);
        int id = installer.createSession(params);
        try (PackageInstaller.Session session = installer.openSession(id)) {
            try (InputStream in = new FileInputStream(apk); OutputStream out = session.openWrite("app", 0, apk.length())) {
                copy(in, out);
                session.fsync(out);
            }
            Intent done = new Intent(DONE).setPackage(activity.getPackageName());
            PendingIntent result = PendingIntent.getBroadcast(activity, id, done, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
            session.commit(result.getIntentSender());
        }
    }

    private void showConfirm() {
        Intent i = confirm;
        if (i == null || !visible) return;
        confirm = null;
        activity.runOnUiThread(() -> {
            installing = false;
            activity.startActivity(i);
        });
    }
}
