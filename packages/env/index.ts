import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  BOT_TOKEN: z.string().min(1, "No token provided"),
  GUILD_ID: z.string().min(1, "No guild ID provided"),

  CLIENT_ID_DISCORD: z.string().min(1, "No Discord client ID provided"),
  CLIENT_SECRET_DISCORD: z.string().min(1, "No Discord client secret provided"),
  REDIRECT_URI: z.string().url("No redirect uri provided"),

  MC_IP: z.string().min(1, "No Minecraft IP provided"),
  MC_PORT: z.coerce.number().int().positive("No Minecraft port provided"),
  OPENER_PORT: z.coerce.number().int().positive("No Opener port provided"),

  DATABASE_URL: z.string().min(1, "No database URL provided"),

  OSU_CLIENT_ID: z.coerce.number().int().positive("No osu! client ID provided"),
  OSU_API_KEY: z.string().min(1, "No osu! API key provided"),
  OSU_BODY: z.string().min(1, "No osu! body provided"),

  MIGRATOR_URL: z.string().url().optional(),
  DOMAIN: z.string().optional(),
  DEV1: z.string().optional(),
  DEV2: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;

/** The parsed env object's full TypeScript type */
export type Env = typeof env;

/** All valid env variable names */
export type EnvVarName = keyof Env;

/**
 * Type-safe env accessor:
 *   getEnvVar('BOT_TOKEN')   // string
 *   getEnvVar('MC_PORT')     // number
 *   getEnvVar('DEV1')        // string | undefined
 *   getEnvVar('TYPO')        // compile error
 */
export function getEnvVar<K extends EnvVarName>(name: K): Env[K] {
  return env[name];
}
