import * as Sentry from '@sentry/nextjs';
import { browserTracingIntegration, replayIntegration } from '@sentry/browser';

export async function register() {
  // instrumentation.ts

Sentry.init({
  dsn: "https://64c05b07193908a2d080c66085c19bb9@o4509589053308928.ingest.de.sentry.io/4509589055471696",

  integrations: [
    browserTracingIntegration(),
    replayIntegration(), // Optional: for Session Replay
  ],

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Session Replay (optional)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Distributed Tracing
  tracePropagationTargets: [
    "localhost",
    /^\//,
    /^https:\/\/yourserver\.io\/api/,
  ],
});

}

export const onRequestError = Sentry.captureRequestError;
