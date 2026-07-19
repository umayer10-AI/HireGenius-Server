import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import type { UserDocument } from "../interfaces/models.js";
declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
            session?: {
                id: string;
                userId: string;
                expiresAt: Date;
            };
        }
    }
}
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireRecruiter: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireCandidate: (req: Request, res: Response, next: NextFunction) => void;
export declare function requireOwnershipOrAdmin(ownerId: ObjectId | string | undefined, user: UserDocument): boolean;
//# sourceMappingURL=auth.middleware.d.ts.map