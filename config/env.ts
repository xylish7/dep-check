export const env = process.env.NODE_ENV as "development" | "production";
export const host = env === "development" ? "http://localhost:3000" : "";

export const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "";

export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN ?? "";

export const githubAppClientId =
  process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID ?? "";
export const githubAppId = process.env.GITHUB_APP_ID ?? "";

// Server-side only
export const supabaseAdminKey = process.env.SUPABASE_ADMIN_KEY ?? "";

export const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export const revalidateToken = process.env.REVALIDATE_TOKEN ?? "";

export const discordPaymentWebhookId =
  process.env.DISCORD_PAYMENT_WEBHOOK_ID ?? "";
export const discordPaymentWebhookToken =
  process.env.DISCORD_PAYMENT_WEBHOOK_TOKEN ?? "";

export const githubAppClientSecret = process.env.GITHUB_APP_CLIENT_SECRET ?? "";
export const githubAppPrivateKey = process.env.GITHUB_APP_PRIVATE_KEY ?? "";
