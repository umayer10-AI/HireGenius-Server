import { UploadApiResponse } from "cloudinary";
export declare function uploadBufferToCloudinary(buffer: Buffer, folder: string, resourceType?: "image" | "raw" | "auto"): Promise<UploadApiResponse>;
export declare function deleteCloudinaryAsset(publicIdOrUrl: string): Promise<void>;
//# sourceMappingURL=upload.service.d.ts.map