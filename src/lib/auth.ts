import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getClient, getDb } from "../config/database.js";
import { env } from "../config/env.js";

// Better Auth options typing is intentionally loose here due to adapter generics
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let authInstance: any = null;

export function createAuth() {
  if (authInstance) {
    return authInstance;
  }

  const db = getDb();
  const client = getClient();

  authInstance = betterAuth({
    database: mongodbAdapter(db, { client }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: [env.FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        enabled: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        path: "/",
      },
    },
  });

  return authInstance;
}

export const auth = {
  api: {
    getSession: (args: { headers: Headers }) => createAuth().api.getSession(args),
  },
};
