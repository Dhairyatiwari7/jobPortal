import * as Sentry from '@sentry/node';
import { Integrations as TracingIntegrations } from '@sentry/tracing';
import mongoose from 'mongoose';

Sentry.init({
  dsn: "https://42aa994085f89251e8cac75da1138a9f@o4509542812024832.ingest.us.sentry.io/4509542816546816",
  integrations: [
    Sentry.mongooseIntegration({ mongoose })
  ],
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});

export { Sentry };
