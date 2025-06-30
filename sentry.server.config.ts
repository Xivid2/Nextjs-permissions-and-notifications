import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://64c05b07193908a2d080c66085c19bb9@o4509589053308928.ingest.de.sentry.io/4509589055471696",

  integrations: [Sentry.browserTracingIntegration()],

  tracesSampleRate: 1.0,
  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^\//,
    /^https:\/\/yourserver\.io\/api/,
  ],
});
