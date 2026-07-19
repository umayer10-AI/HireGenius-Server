import { cloudinary } from "../config/cloudinary.js";
import { AppError } from "../utils/errors.js";
export async function uploadBufferToCloudinary(buffer, folder, resourceType = "auto") {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: `hiregenius/${folder}`,
            resource_type: resourceType,
            transformation: resourceType === "image"
                ? [{ quality: "auto", fetch_format: "auto" }]
                : undefined,
        }, (error, result) => {
            if (error || !result) {
                reject(new AppError(error?.message || "Cloudinary upload failed", 500));
                return;
            }
            resolve(result);
        });
        stream.end(buffer);
    });
}
export async function deleteCloudinaryAsset(publicIdOrUrl) {
    if (!publicIdOrUrl)
        return;
    let publicId = publicIdOrUrl;
    if (publicIdOrUrl.includes("cloudinary.com")) {
        const parts = publicIdOrUrl.split("/");
        const uploadIndex = parts.findIndex((p) => p === "upload");
        if (uploadIndex >= 0) {
            const afterUpload = parts.slice(uploadIndex + 1);
            const withoutVersion = afterUpload[0]?.startsWith("v")
                ? afterUpload.slice(1)
                : afterUpload;
            publicId = withoutVersion.join("/").replace(/\.[^/.]+$/, "");
        }
    }
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }
    catch {
        try {
            await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
        }
        catch {
            // ignore deletion failures for missing assets
        }
    }
}
//# sourceMappingURL=upload.service.js.map