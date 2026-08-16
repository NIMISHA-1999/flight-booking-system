import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth.types";
export declare const requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=role.middleware.d.ts.map