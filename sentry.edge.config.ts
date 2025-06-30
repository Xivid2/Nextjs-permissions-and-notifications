import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://64c05b07193908a2d080c66085c19bb9@o4509589053308928.ingest.de.sentry.io/4509589055471696",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});