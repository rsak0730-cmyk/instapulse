# Android build notes

GitHub Actions installs Gradle and builds this project with `gradle assembleDebug`. For local Android Studio use, open this `android/` directory. If your IDE requests a Gradle wrapper, generate one with a compatible Gradle installation (`gradle wrapper`) and commit the resulting wrapper files. The app bundles the website under `app/src/main/assets/web/`.
