"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../config/database");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
class AuthService {
    async register(data) {
        const existingUser = await database_1.prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (existingUser) {
            throw new Error("Email already exists");
        }
        const passwordHash = await (0, hash_1.hashPassword)(data.password);
        const user = await database_1.prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
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
    async login(data) {
        const user = await database_1.prisma.user.findUnique({
            where: {
                email: data.email,
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
}
exports.AuthService = AuthService;
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map