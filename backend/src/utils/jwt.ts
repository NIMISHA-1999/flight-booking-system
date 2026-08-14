import jwt, { Secret, SignOptions } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: Secret =
  process.env.JWT_ACCESS_SECRET || "access_secret";

const REFRESH_TOKEN_SECRET: Secret =
  process.env.JWT_REFRESH_SECRET || "refresh_secret";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: "15m",
  };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
};