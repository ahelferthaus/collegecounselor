// Allowlist of emails permitted to use the app while it's private. Accounts are
// pre-created (no public sign-up), and this is the in-app double-check: even a
// valid Supabase session is only allowed through if its email is listed here.
//
// Override/extend without a code change via VITE_ALLOWED_EMAILS (comma-separated).
const DEFAULT_ALLOWED = ['biga_72@yahoo.com'];

export const ALLOWED_EMAILS: string[] = (
  (import.meta.env.VITE_ALLOWED_EMAILS as string | undefined)
    ?.split(',')
    .map((e) => e.trim())
    .filter(Boolean) ?? DEFAULT_ALLOWED
).map((e) => e.toLowerCase());

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED_EMAILS.includes(email.toLowerCase());
}
