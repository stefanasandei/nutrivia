import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z
      .string()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    UPLOADTHING_SECRET: z.string(),
    UPLOADTHING_APP_ID: z.string(),
    ADMIN_ID: z.string(),
    FIREBASE_PRIVATE_KEY: z.string(),
    FIREBASE_PRIVATE_EMAIL: z.string(),
  },

  client: {
    NEXT_PUBLIC_VAPID_KEY: z.string(),
    NEXT_PUBLIC_FIREBASE_KEY: z.string(),
    NEXT_PUBLIC_FIREBASE_PROJECT: z.string(),
    NEXT_PUBLIC_FIREBASE_ID: z.string(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    ADMIN_ID: process.env.ADMIN_ID,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PRIVATE_EMAIL: process.env.FIREBASE_PRIVATE_EMAIL,

    NEXT_PUBLIC_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
    NEXT_PUBLIC_FIREBASE_KEY: process.env.NEXT_PUBLIC_FIREBASE_KEY,
    NEXT_PUBLIC_FIREBASE_PROJECT: process.env.NEXT_PUBLIC_FIREBASE_PROJECT,
    NEXT_PUBLIC_FIREBASE_ID: process.env.NEXT_PUBLIC_FIREBASE_ID,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
