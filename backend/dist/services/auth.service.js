"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../config/database");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    /**
     * Hash refresh token before storing it in DB.
     * We never store the raw refresh token.
     */
    hashRefreshToken(token) {
        return crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
    }
    /**
     * Store refresh token in database.
     */
    async saveRefreshToken(userId, refreshToken) {
        const tokenHash = this.hashRefreshToken(refreshToken);
        const expiresAt = new Date();
        // Refresh token lifetime: 7 days
        expiresAt.setDate(expiresAt.getDate() + 7);
        await database_1.prisma.refreshToken.create({
            data: {
                tokenHash,
                userId,
                expiresAt,
            },
        });
    }
    /**
     * Register
     */
    async register(data) {
        const email = data.email
            .trim()
            .toLowerCase();
        const existingUser = await database_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            throw new Error("Email already exists");
        }
        const passwordHash = await (0, hash_1.hashPassword)(data.password);
        const user = await database_1.prisma.user.create({
            data: {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email,
                passwordHash,
            },
        });
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        await this.saveRefreshToken(user.id, refreshToken);
        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }
    /**
     * Login
     */
    async login(data) {
        const email = data.email
            .trim()
            .toLowerCase();
        const user = await database_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const isPasswordCorrect = await (0, hash_1.comparePassword)(data.password, user.passwordHash);
        if (!isPasswordCorrect) {
            throw new Error("Invalid email or password");
        }
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        await this.saveRefreshToken(user.id, refreshToken);
        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }
    /**
     * Refresh access token.
     *
     * Old refresh token is revoked and
     * a new refresh token is generated.
     */
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }
        let payload;
        try {
            payload =
                (0, jwt_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw new Error("Invalid or expired refresh token");
        }
        const tokenHash = this.hashRefreshToken(refreshToken);
        const storedToken = await database_1.prisma.refreshToken.findUnique({
            where: {
                tokenHash,
            },
        });
        if (!storedToken) {
            throw new Error("Refresh token not found");
        }
        if (storedToken.revokedAt) {
            throw new Error("Refresh token has been revoked");
        }
        if (storedToken.expiresAt <
            new Date()) {
            throw new Error("Refresh token has expired");
        }
        const user = await database_1.prisma.user.findUnique({
            where: {
                id: payload.userId,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        // Revoke old refresh token
        await database_1.prisma.refreshToken.update({
            where: {
                id: storedToken.id,
            },
            data: {
                revokedAt: new Date(),
            },
        });
        // Generate new tokens
        const accessToken = (0, jwt_1.generateAccessToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const newRefreshToken = (0, jwt_1.generateRefreshToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        await this.saveRefreshToken(user.id, newRefreshToken);
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
    /**
     * Logout.
     *
     * Revoke the refresh token in database.
     */
    async logout(refreshToken) {
        if (!refreshToken) {
            return;
        }
        const tokenHash = this.hashRefreshToken(refreshToken);
        const storedToken = await database_1.prisma.refreshToken.findUnique({
            where: {
                tokenHash,
            },
        });
        if (!storedToken) {
            return;
        }
        if (!storedToken.revokedAt) {
            await database_1.prisma.refreshToken.update({
                where: {
                    id: storedToken.id,
                },
                data: {
                    revokedAt: new Date(),
                },
            });
        }
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map