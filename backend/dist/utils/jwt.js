"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const generateAccessToken = (payload) => {
    const options = {
        expiresIn: "15m",
    };
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    const options = {
        expiresIn: "7d",
    };
    return jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, options);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwt.js.map