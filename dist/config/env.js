"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.coerce.number().default(5000),
    FRONTEND_URL: zod_1.z.string().url(),
    MONGODB_URI: zod_1.z.string().min(1),
    MONGODB_DB_NAME: zod_1.z.string().default("hiregenius"),
    JWT_SECRET: zod_1.z.string().min(16),
    BETTER_AUTH_SECRET: zod_1.z.string().min(16),
    BETTER_AUTH_URL: zod_1.z.string().url(),
    GOOGLE_CLIENT_ID: zod_1.z.string().optional().default(""),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().optional().default(""),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().min(1),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1),
    CLOUDINARY_UPLOAD_PRESET: zod_1.z.string().default("HireGenius"),
    OPENAI_API_KEY: zod_1.z.string().optional().default(""),
    GEMINI_API_KEY: zod_1.z.string().optional().default(""),
    GROQ_API_KEY: zod_1.z.string().optional().default(""),
    AI_PROVIDER: zod_1.z.enum(["openai", "gemini", "claude", "groq", "ollama"]).default("groq"),
    SMTP_HOST: zod_1.z.string().optional().default(""),
    SMTP_PORT: zod_1.z.coerce.number().default(587),
    SMTP_USER: zod_1.z.string().optional().default(""),
    SMTP_PASS: zod_1.z.string().optional().default(""),
    EMAIL_FROM: zod_1.z.string().default("HireGenius AI <noreply@hiregenius.ai>"),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().default(900000),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().default(200),
    AI_RATE_LIMIT_FREE: zod_1.z.coerce.number().default(20),
    AI_RATE_LIMIT_PREMIUM: zod_1.z.coerce.number().default(500),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map