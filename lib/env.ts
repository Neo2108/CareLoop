/**
 * Validates required environment variables at startup.
 * Call this from instrumentation or a startup module to fail fast if config is missing.
 */

const required = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
] as const;

export function validateEnv(): { valid: true } | { valid: false; missing: string[] } {
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    return { valid: false, missing: [...missing] };
  }
  return { valid: true };
}

/**
 * Call during app initialization. Throws if required env vars are missing.
 */
export function assertEnv(): void {
  const result = validateEnv();
  if (!result.valid) {
    throw new Error(
      `Missing required environment variables: ${result.missing.join(", ")}. ` +
        "See .env.example for reference."
    );
  }
}
