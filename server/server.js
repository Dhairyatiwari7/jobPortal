import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
//import { Sentry } from './config/instrument.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCLoudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js'; 
import {clerkMiddleware} from '@clerk/express';

const app = express();

await connectDB();
await connectCLoudinary();

// // ✅ Sentry middleware (must come before routes)
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(express.json());

// ✅ Routes
app.get('/', (req, res) => {
  res.send("hello from server");
});

// app.get('/debug-sentry', (req, res) => {
//   throw new Error("This is a test error for Sentry");
// });

app.post('/webhooks', clerkWebhooks);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);

// ✅ Error handling middleware (after all routes)
// app.use(Sentry.Handlers.errorHandler());

// // Optional fallback error handler
// app.use((err, req, res, next) => {
//   console.error("Final Error Handler:", err);
//   res.status(500).send("Something went wrong: " + (res.sentry || ""));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
