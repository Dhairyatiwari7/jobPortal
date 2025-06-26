import * as Sentry from '@sentry/node';
import '@sentry/tracing';

Sentry.init({
  dsn: "https://42aa994085f89251e8cac75da1138a9f@o4509542812024832.ingest.us.sentry.io/4509542816546816",
  integrations: [
    Sentry.mongooseIntegration()
  ],
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});

export { Sentry }; 
