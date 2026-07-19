import multer from "multer";
import { AppError } from "../utils/errors.js";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const storage = multer.memoryStorage();

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void {
  const allowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];
  if (!allowed.includes(file.mimetype)) {
    cb(new AppError("Invalid file type. Allowed: images, PDF, DOC, DOCX, TXT", 400));
    return;
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(new AppError("Only image files are allowed", 400));
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadDocument = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_DOC_TYPES.includes(file.mimetype)) {
      cb(new AppError("Only PDF, DOC, DOCX, or TXT files are allowed", 400));
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});
