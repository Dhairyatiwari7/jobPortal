import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { Sentry } from './config/instrument.js'; // 🛠️ fix: use named import
import { clerkWebhooks } from './controllers/webhooks.js';

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send("hello from server");
});

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.post('/webhooks',clerkWebhooks);

// Sentry error handler (must be after all routes)
Sentry.setupExpressErrorHandler(app);

// Optional fallback error handler
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
