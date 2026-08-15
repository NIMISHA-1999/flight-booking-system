"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    /**
     * =====================================================
     * REGISTER
     * =====================================================
     */
    async register(req, res) {
        try {
            console.log("REGISTER BODY:", req.body);
            const { firstName, lastName, email, password, } = req.body ?? {};
            if (!firstName?.trim() ||
                !lastName?.trim() ||
                !email?.trim() ||
                !password) {
                return res.status(400).json({
                    success: false,
                    message: "First name, last name, email and password are required",
                });
            }
            const result = await auth_service_1.default.register({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                password,
            });
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result,
            });
        }
        catch (error) {
            console.error("REGISTER ERROR:", error);
            return res.status(400).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Registration failed",
            });
        }
    }
    /**
     * =====================================================
     * LOGIN
     * =====================================================
     */
    async login(req, res) {
        try {
            console.log("LOGIN BODY:", req.body);
            const { email, password, } = req.body ?? {};
            if (!email?.trim() || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required",
                });
            }
            const result = await auth_service_1.default.login({
                email: email.trim().toLowerCase(),
                password,
            });
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: result,
            });
        }
        catch (error) {
            console.error("LOGIN ERROR:", error);
            return res.status(401).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Invalid email or password",
            });
        }
    }
    /**
     * =====================================================
     * REFRESH ACCESS TOKEN
     * =====================================================
     */
    async refresh(req, res) {
        try {
            const { refreshToken, } = req.body ?? {};
            if (!refreshToken ||
                typeof refreshToken !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Refresh token is required",
                });
            }
            const result = await auth_service_1.default.refresh(refreshToken);
            return res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: result,
            });
        }
        catch (error) {
            console.error("REFRESH ERROR:", error);
            return res.status(401).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Unable to refresh token",
            });
        }
    }
    /**
     * =====================================================
     * LOGOUT
     * =====================================================
     */
    async logout(req, res) {
        try {
            const { refreshToken, } = req.body ?? {};
            if (!refreshToken ||
                typeof refreshToken !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Refresh token is required",
                });
            }
            await auth_service_1.default.logout(refreshToken);
            return res.status(200).json({
                success: true,
                message: "Logout successful",
            });
        }
        catch (error) {
            console.error("LOGOUT ERROR:", error);
            return res.status(400).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Logout failed",
            });
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map