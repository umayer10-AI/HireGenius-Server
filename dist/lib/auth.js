"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
exports.createAuth = createAuth;
const better_auth_1 = require("better-auth");
const mongodb_1 = require("better-auth/adapters/mongodb");
const database_1 = require("../config/database");
const env_1 = require("../config/env");
// Better Auth options typing is intentionally loose here due to adapter generics
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let authInstance = null;
function createAuth() {
    if (authInstance) {
        return authInstance;
    }
    const db = (0, database_1.getDb)();
    const client = (0, database_1.getClient)();
    authInstance = (0, better_auth_1.betterAuth)({
        database: (0, mongodb_1.mongodbAdapter)(db, { client }),
        secret: env_1.env.BETTER_AUTH_SECRET,
        baseURL: env_1.env.BETTER_AUTH_URL,
        trustedOrigins: [env_1.env.FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
        emailAndPassword: {
            enabled: true,
            minPasswordLength: 8,
        },
        socialProviders: {
            google: {
                clientId: env_1.env.GOOGLE_CLIENT_ID,
                clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
                enabled: Boolean(env_1.env.GOOGLE_CLIENT_ID && env_1.env.GOOGLE_CLIENT_SECRET),
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
                secure: env_1.env.NODE_ENV === "production",
                httpOnly: true,
                path: "/",
            },
        },
    });
    return authInstance;
}
exports.auth = {
    api: {
        getSession: (args) => createAuth().api.getSession(args),
    },
};
//# sourceMappingURL=auth.js.map