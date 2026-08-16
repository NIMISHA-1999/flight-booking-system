"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    try {
        console.log("\n========== AUTH DEBUG ==========");
        const authHeader = req.headers.authorization;
        console.log("Authorization:", authHeader
            ? `${authHeader.substring(0, 30)}...`
            : "MISSING");
        /*
         * Authorization header
         */
        if (!authHeader) {
            console.log("AUTH FAILED: Authorization header missing");
            return res.status(401).json({
                success: false,
                message: "Authorization header is missing.",
                code: "AUTH_HEADER_MISSING",
            });
        }
        /*
         * Bearer token
         */
        if (!authHeader.startsWith("Bearer ")) {
            console.log("AUTH FAILED: Invalid Bearer format");
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format.",
                code: "INVALID_AUTH_FORMAT",
            });
        }
        const token = authHeader.substring(7).trim();
        if (!token) {
            console.log("AUTH FAILED: Access token missing");
            return res.status(401).json({
                success: false,
                message: "Access token is missing.",
                code: "ACCESS_TOKEN_MISSING",
            });
        }
        console.log("Token exists:", true);
        console.log("Token length:", token.length);
        /*
         * JWT secret check
         */
        if (!process.env.JWT_ACCESS_SECRET) {
            console.error("JWT_ACCESS_SECRET is not configured.");
            return res.status(500).json({
                success: false,
                message: "Authentication service is not configured.",
            });
        }
        console.log("JWT_ACCESS_SECRET exists:", true);
        /*
         * Verify JWT
         */
        console.log("Verifying access token...");
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        console.log("TOKEN VERIFIED SUCCESSFULLY:", decoded);
        /*
         * Validate payload
         */
        if (!decoded.userId) {
            console.log("AUTH FAILED: userId missing");
            return res.status(401).json({
                success: false,
                message: "Invalid token payload.",
                code: "INVALID_TOKEN_PAYLOAD",
            });
        }
        /*
         * Attach authenticated user
         */
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        console.log("AUTH SUCCESS");
        console.log("req.user:", req.user);
        console.log("================================\n");
        return next();
    }
    catch (error) {
        console.error("\n========== JWT VERIFY ERROR ==========");
        console.error("Error:", error);
        /*
         * JWT expired
         */
        if (error instanceof Error &&
            error.name === "TokenExpiredError") {
            console.error("ACCESS TOKEN EXPIRED");
            console.error("======================================\n");
            return res.status(401).json({
                success: false,
                message: "Access token expired.",
                code: "ACCESS_TOKEN_EXPIRED",
            });
        }
        /*
         * Invalid JWT
         */
        if (error instanceof Error &&
            error.name === "JsonWebTokenError") {
            console.error("INVALID ACCESS TOKEN");
            console.error("======================================\n");
            return res.status(401).json({
                success: false,
                message: "Invalid access token.",
                code: "INVALID_ACCESS_TOKEN",
            });
        }
        /*
         * Other authentication error
         */
        console.error("UNKNOWN AUTHENTICATION ERROR");
        console.error("======================================\n");
        return res.status(401).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Authentication failed.",
            code: "AUTHENTICATION_FAILED",
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map