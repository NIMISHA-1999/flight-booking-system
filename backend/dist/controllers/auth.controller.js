"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    async register(req, res) {
        try {
            const result = await auth_service_1.default.register(req.body);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Registration failed";
            return res.status(400).json({
                success: false,
                message,
            });
        }
    }
    async login(req, res) {
        try {
            const result = await auth_service_1.default.login(req.body);
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: result,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Login failed";
            return res.status(401).json({
                success: false,
                message,
            });
        }
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map