import jwt from "jsonwebtoken";
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
export const generateAccessToken = (payload) => {
    const options = {
        expiresIn: "15m",
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
};
export const generateRefreshToken = (payload) => {
    const options = {
        expiresIn: "7d",
    };
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
