"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    try {
        console.log("\n========== AUTH DEBUG ==========");
        const authHeader = req.headers.authorization;
        console.log("Authorization header exists:", !!authHeader);
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header is missing.",
            });
        }
        if (!authHeader.startsWith("Bearer ")) {
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
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        console.log("Decoded token:", decoded);
        if (!decoded.userId) {
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
        console.error("JWT VERIFY ERROR:", error);
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