package com.paperkite.books;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Locale;
import java.util.Set;

/** Shows the book app and gives it what a web page cannot do alone: files, voices, and saving a PDF. */
public class MainActivity extends Activity {
    private static final int PICK_IMAGE = 1;
    private static final int SAVE_FILE = 2;

    private WebView web;
    private TextToSpeech tts;
    private volatile boolean ttsReady;
    private ValueCallback<Uri[]> pickCallback;
    private byte[] pendingFile;
    private Updater updater;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.setBackgroundColor(0xFFDCEBFA);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(true);
        s.setBlockNetworkLoads(true); // Only the update check uses the internet, never the page.
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                return true; // The app stays on its own page.
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (pickCallback != null) pickCallback.onReceiveValue(null);
                pickCallback = cb;
                Intent i = new Intent(Intent.ACTION_GET_CONTENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("image/*");
                try {
                    startActivityForResult(Intent.createChooser(i, "Choose a picture"), PICK_IMAGE);
                } catch (ActivityNotFoundException e) {
                    pickCallback = null;
                    return false;
                }
                return true;
            }
        });
        setContentView(web);
        startVoices();
        web.loadUrl("file:///android_asset/index.html");
        updater = new Updater(this);
        updater.check();
    }

    @Override
    protected void onResume() {
        super.onResume();
        updater.onShown();
    }

    @Override
    protected void onStop() {
        updater.onHidden();
        super.onStop();
    }

    private void startVoices() {
        tts = new TextToSpeech(getApplicationContext(), status -> {
            ttsReady = status == TextToSpeech.SUCCESS;
            if (!ttsReady) return;
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String id) { }
                @Override public void onDone(String id) { js("window.__tts&&__tts('end'," + num(id) + ")"); }
                @Override public void onError(String id) { js("window.__tts&&__tts('end'," + num(id) + ")"); }
                @Override public void onRangeStart(String id, int start, int end, int frame) {
                    js("window.__tts&&__tts('range'," + num(id) + "," + start + "," + (end - start) + ")");
                }
            });
            js("window.__tts&&__tts('ready')");
        });
    }

    private static long num(String id) {
        try { return Long.parseLong(id); } catch (NumberFormatException e) { return 0; }
    }

    private void js(String code) {
        web.post(() -> web.evaluateJavascript(code, null));
    }

    private File bookFile(String id) {
        if (id == null || !id.matches("[A-Za-z0-9_-]{1,80}")) return null;
        File dir = new File(getFilesDir(), "books");
        dir.mkdirs();
        return new File(dir, id + ".json");
    }

    /** Called from the page's script. */
    private class Bridge {
        @JavascriptInterface
        public String listBooks() {
            StringBuilder out = new StringBuilder("[");
            File[] files = new File(getFilesDir(), "books").listFiles((d, n) -> n.endsWith(".json"));
            if (files != null) {
                boolean first = true;
                for (File f : files) {
                    try {
                        String text = new String(Files.readAllBytes(f.toPath()), StandardCharsets.UTF_8);
                        if (!first) out.append(',');
                        out.append(text);
                        first = false;
                    } catch (Exception ignored) { }
                }
            }
            return out.append(']').toString();
        }

        @JavascriptInterface
        public boolean saveBook(String id, String json) {
            File f = bookFile(id);
            if (f == null) return false;
            File tmp = new File(f.getPath() + ".tmp");
            try (FileOutputStream o = new FileOutputStream(tmp)) {
                o.write(json.getBytes(StandardCharsets.UTF_8));
                o.getFD().sync();
            } catch (Exception e) {
                tmp.delete();
                return false;
            }
            return tmp.renameTo(f);
        }

        @JavascriptInterface
        public void deleteBook(String id) {
            File f = bookFile(id);
            if (f != null) f.delete();
        }

        @JavascriptInterface
        public String voices() {
            JSONArray out = new JSONArray();
            if (!ttsReady) return out.toString();
            try {
                Set<Voice> all = tts.getVoices();
                if (all != null) for (Voice v : all) {
                    if (v.isNetworkConnectionRequired()) continue;
                    if (v.getFeatures() != null && v.getFeatures().contains("notInstalled")) continue;
                    JSONObject o = new JSONObject();
                    o.put("name", v.getName());
                    o.put("lang", v.getLocale().toLanguageTag());
                    o.put("voiceURI", v.getName());
                    out.put(o);
                }
            } catch (Exception ignored) { }
            return out.toString();
        }

        @JavascriptInterface
        public void speak(String id, String text, String lang, String voice, float pitch, float rate) {
            if (!ttsReady) { js("window.__tts&&__tts('end'," + num(id) + ")"); return; }
            tts.setLanguage(Locale.forLanguageTag(lang));
            if (voice != null && !voice.isEmpty()) {
                Set<Voice> all = tts.getVoices();
                if (all != null) for (Voice v : all) if (voice.equals(v.getName())) tts.setVoice(v);
            }
            tts.setPitch(pitch);
            tts.setSpeechRate(rate);
            tts.speak(text, TextToSpeech.QUEUE_ADD, null, id);
        }

        @JavascriptInterface
        public void stop() {
            if (ttsReady) tts.stop();
        }

        @JavascriptInterface
        public void saveFile(String name, String base64) {
            pendingFile = Base64.decode(base64, Base64.DEFAULT);
            Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("application/pdf");
            i.putExtra(Intent.EXTRA_TITLE, name);
            runOnUiThread(() -> {
                try {
                    startActivityForResult(i, SAVE_FILE);
                } catch (ActivityNotFoundException e) {
                    pendingFile = null;
                    js("window.__fileDone&&__fileDone(false)");
                }
            });
        }
    }

    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        Uri uri = (result == RESULT_OK && data != null) ? data.getData() : null;
        if (request == PICK_IMAGE && pickCallback != null) {
            pickCallback.onReceiveValue(uri == null ? null : new Uri[]{uri});
            pickCallback = null;
        } else if (request == SAVE_FILE) {
            byte[] bytes = pendingFile;
            pendingFile = null;
            if (uri == null) { js("window.__fileDone&&__fileDone('declined')"); return; }
            boolean ok = false;
            try (OutputStream o = getContentResolver().openOutputStream(uri)) {
                if (o != null && bytes != null) { o.write(bytes); ok = true; }
            } catch (Exception ignored) { }
            js("window.__fileDone&&__fileDone(" + ok + ")");
        }
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.__back?window.__back():false", v -> {
            if (!"true".equals(v)) leaveApp();
        });
    }

    private void leaveApp() {
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (tts != null) tts.shutdown();
        web.destroy();
        super.onDestroy();
    }
}
