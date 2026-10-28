require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const port = Number(process.env.PORT || 8080);
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5500' }));
app.use(express.json({ limit: '32kb' }));
app.use(morgan('tiny'));
app.get('/health', (_req, res) => res.json({ ok: true, service: 'instapulse-api', mode: 'starter' }));
app.get('/api/dashboard', (_req, res) => {
  // Demo response only. Replace with data fetched from Meta Graph API after OAuth is implemented.
  res.json({ mode: 'demo', metrics: { reach: 84200, engagementRate: 5.84, followers: 12480, interactions: 6391 }, note: 'Illustrative data; not live Instagram insights.' });
});
app.get('/auth/meta/start', (_req, res) => {
  if (!process.env.META_APP_ID || !process.env.META_REDIRECT_URI) {
    return res.status(503).json({ error: 'meta_not_configured', message: 'Configure META_APP_ID and META_REDIRECT_URI in the backend environment first.' });
  }
  // Deliberately not generating an authorization URL until the chosen Meta API product,
  // required scopes, state/session storage, and redirect flow are configured and reviewed.
  return res.status(501).json({ error: 'oauth_not_implemented', message: 'Finish the Meta OAuth flow for your selected Instagram API product before enabling account connection.' });
});
app.get('/auth/meta/callback', (_req, res) => res.status(501).send('Meta OAuth callback is not implemented. Configure and test this endpoint before production use.'));
app.use((req, res) => res.status(404).json({ error: 'not_found', path: req.path }));
app.listen(port, () => console.log(`InstaPulse API starter listening on port ${port}`));
