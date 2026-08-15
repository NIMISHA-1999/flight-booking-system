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
        if (!authHeader) {
            console.log("AUTH FAILED: Authorization header missing");
            return res.status(401).json({
                success: false,
                message: "Authorization header is missing.",
            });
        }
        if (!authHeader.startsWith("Bearer ")) {
            console.log("AUTH FAILED: Invalid Bearer format");
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format.",
            });
        }
        const token = authHeader.substring(7).trim();
        console.log("Token exists:", !!token);
        console.log("Token length:", token.length);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is missing.",
            });
        }
        console.log("JWT_ACCESS_SECRET exists:", !!process.env.JWT_ACCESS_SECRET);
        console.log("JWT_ACCESS_SECRET length:", process.env.JWT_ACCESS_SECRET?.length);
        console.log("Verifying access token...");
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        console.log("TOKEN VERIFIED SUCCESSFULLY:", decoded);
        if (!decoded.userId) {
            console.log("AUTH FAILED: userId missing");
            return res.status(401).json({
                success: false,
                message: "Invalid token payload.",
            });
        }
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
        console.error("========== JWT VERIFY ERROR ==========");
        console.error("Error:", error);
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
        }
        console.error("======================================\n");
        return res.status(401).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Invalid or expired token.",
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map