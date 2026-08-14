import { prisma } from "../config/database";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken, } from "../utils/jwt";
export class AuthService {
    async register(data) {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (existingUser) {
            throw new Error("Email already exists");
        }
        const passwordHash = await hashPassword(data.password);
        const user = await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                passwordHash,
            },
        });
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
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
        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const isPasswordCorrect = await comparePassword(data.password, user.passwordHash);
        if (!isPasswordCorrect) {
            throw new Error("Invalid email or password");
        }
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
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
export default new AuthService();
