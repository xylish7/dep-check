import { TODO } from "@/shared/types";
import * as Sentry from "@sentry/nextjs";

const exceptionMessages = [
  "TypeError: Failed to fetch",
  "TypeError: Load failed",
  "TypeError: NetworkError when attempting to fetch resource.",
  "JWT expired",
];

export default function logSentryError(error: TODO, identifier?: string) {
  if (exceptionMessages.includes(error?.message)) {
    return;
  }

  if (error?.code === "DBREQ") {
    Sentry.captureMessage(error.message, "info");
    return;
  }

  if (identifier) {
    Sentry.captureException(error, (scope) => {
      scope.setTransactionName(identifier);
      return scope;
    });
    return;
  }

  Sentry.captureException(error);
}
