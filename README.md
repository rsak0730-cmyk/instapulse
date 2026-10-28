# InstaPulse — Creator Analytics (Starter Project)

InstaPulse is a responsive Instagram-analytics dashboard prototype with a bundled Android WebView app, an Express backend starter, and GitHub Actions workflows for automatic website deployment and debug APK builds.

> **Honest status:** The dashboard runs on clearly labelled illustrative demo data. The backend is a starter, not a completed Meta OAuth integration. Real Instagram insights require your own Meta developer app, an eligible account, configured OAuth, approved/available permissions, secure token handling, and API-specific endpoints. Do not present demo metrics as live account data.

## Included

- `index.html`, `assets/css/styles.css`, `assets/js/app.js` — responsive dark dashboard with overview, sample content library, audience charts, creator experiments, connection checklist, preferences, and CSV export.
- `android/` — Kotlin Android app that bundles the website and can be built as a debug APK.
- `backend/` — Express API starter with health check, demo dashboard endpoint, safe placeholder routes, `.env.example`, and Dockerfile.
- `.github/workflows/deploy-website.yml` — deploys the static website to GitHub Pages.
- `.github/workflows/build-android.yml` — builds and uploads a debug APK artifact.

## 1. Upload to GitHub

1. Create a new empty GitHub repository.
2. Extract this ZIP on your computer or phone.
3. Upload **the contents of the extracted folder** to the repository root (so `index.html`, `assets/`, `android/`, `backend/`, and `.github/` are at the root).
4. Commit to `main` (or `master`).

## 2. Enable the website

1. Open repository **Settings → Pages**.
2. Under build and deployment, select **GitHub Actions** as the source.
3. Push to `main` or run **Actions → Deploy InstaPulse website → Run workflow**.
4. When the workflow completes, the Pages URL appears in the deployment summary and repository Pages settings.

The site is static and works on GitHub Pages. The backend is not deployed by this workflow; deploy it separately to a Node-compatible HTTPS host.

## 3. Get the Android APK

1. Push the project to GitHub.
2. Open the repository **Actions** tab.
3. Select **Build InstaPulse Android APK** and open the latest successful run.
4. Download the `InstaPulse-debug-apk` artifact. GitHub may require you to be signed in to download artifacts.

The workflow copies the latest root website into Android assets before building, so the app uses the same dashboard. The generated APK is a **debug APK**, not a Play Store release. For a release build, add secure signing configuration through GitHub Actions secrets and follow Android release-signing guidance.

## 4. Run the website locally

The static website can be opened directly, but a local server is recommended:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## 5. Run the backend locally

Requires Node.js 20 or newer.

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Check `http://localhost:8080/health` and `http://localhost:8080/api/dashboard`.

Before deploying, set `FRONTEND_ORIGIN` to your actual website origin and configure secrets using your hosting provider's secret manager. Do not commit `.env`, App Secrets, access tokens, or other credentials.

## 6. Implement official Instagram / Meta integration

The connection page intentionally explains the requirements instead of pretending that live access works. Meta products and permission requirements can change; consult the current official docs before implementing the flow: https://developers.facebook.com/docs/instagram-platform/

At minimum, a production implementation should:

1. Select the supported Instagram API product and flow for your account type/use case.
2. Create/configure a Meta developer app and exact HTTPS redirect URI.
3. Implement OAuth `state` generation/validation, callback handling, token exchange, token storage, refresh/expiry handling, and disconnect/revocation.
4. Request only the permissions currently needed; complete access review/app review if required.
5. Fetch only endpoints/metrics that are available for the selected API and authorized account. API access to demographics, insights, media, and metrics varies by product, account, permissions, and API version.
6. Add authentication/authorization to your own API, rate limiting, input validation, logging without secrets, deletion controls, and a privacy policy before public launch.
7. Replace demo metrics in the frontend with authenticated calls to your backend. Never expose the Meta App Secret or user access tokens in browser JavaScript.

The included `/auth/meta/start` and `/auth/meta/callback` routes are deliberate placeholders and return a non-success status until you implement and test the flow. They do not log in to Instagram yet.

## Architecture

```text
InstaPulse/
├── index.html
├── assets/{css,js}/
├── android/                 # Kotlin WebView shell
├── backend/                 # Express starter API
└── .github/workflows/       # Pages deployment + Android APK build
```

## Troubleshooting

- **Blank website on GitHub Pages:** ensure `index.html` and `assets/` are at repository root and that the Pages workflow succeeded.
- **No APK artifact:** check the Android workflow logs. The artifact appears only after a successful build.
- **Android changes not reflected:** the workflow copies root `index.html` and `assets/` into Android assets during the build. Trigger a new workflow run after changing them.
- **Instagram connect unavailable:** expected until you implement Meta OAuth and configure your developer app. Do not add secrets to frontend files.

## License

You may adapt this starter for your own project. Instagram and Meta are trademarks of their respective owners. This project is not affiliated with or endorsed by Meta.
