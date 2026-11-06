# Paper Kite Books

An Android app for making, saving and reading children's picture books. It runs in portrait mode only.

## Install
Download the APK from the Releases page and open it on an Android 8.0 or newer phone. Android may ask you to allow installs from this source.

## Make a new release
1. Update `version.properties`. Raise `VERSION_CODE` by 1 for every release.
2. Add the new version to `CHANGELOG.md`.
3. Commit to `main`.

The change to `version.properties` starts the workflow. It builds the APK, creates the version tag, and publishes the GitHub release. Installed apps find the new build the next time they open. A version with a suffix, such as `-beta.1`, becomes a pre-release.

## Project layout
- `tools/paper-kite-books.html`: the app itself.
- `tools/native-shim.js`: connects reading aloud to Android.
- `tools/build_assets.py`: builds the page that goes inside the app.
- `app/`: the Android project.
