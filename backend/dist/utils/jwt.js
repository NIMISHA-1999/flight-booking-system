"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
if (!ACCESS_TOKEN_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
}
if (!REFRESH_TOKEN_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
}
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
}
function generateRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
}
//# sourceMappingURL=jwt.js.map