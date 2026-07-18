"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = exports.uploadImage = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../utils/errors");
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOC_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
];
const storage = multer_1.default.memoryStorage();
function fileFilter(_req, file, cb) {
    const allowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];
    if (!allowed.includes(file.mimetype)) {
        cb(new errors_1.AppError("Invalid file type. Allowed: images, PDF, DOC, DOCX, TXT", 400));
        return;
    }
    cb(null, true);
}
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});
exports.uploadImage = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
            cb(new errors_1.AppError("Only image files are allowed", 400));
            return;
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.uploadDocument = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED_DOC_TYPES.includes(file.mimetype)) {
            cb(new errors_1.AppError("Only PDF, DOC, DOCX, or TXT files are allowed", 400));
            return;
        }
        cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
});
//# sourceMappingURL=upload.middleware.js.map