import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: string =
  process.env.JWT_ACCESS_SECRET ?? "";

const REFRESH_TOKEN_SECRET: string =
  process.env.JWT_REFRESH_SECRET ?? "";

const ACCESS_TOKEN_EXPIRES_IN =
  process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";

const REFRESH_TOKEN_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("JWT_REFRESH_SECRET is not defined");
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}

export function generateAccessToken(
  payload: JwtPayload
): string {
  return jwt.sign(
    payload,
    ACCESS_TOKEN_SECRET,
    {
      expiresIn:
        ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
}

export function generateRefreshToken(
  payload: JwtPayload
): string {
  return jwt.sign(
    payload,
    REFRESH_TOKEN_SECRET,
    {
      expiresIn:
        REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
}

export function verifyAccessToken(
  token: string
): JwtPayload {
  const decoded = jwt.verify(
    token,
    ACCESS_TOKEN_SECRET
  );

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded) ||
    !("email" in decoded) ||
    !("role" in decoded)
  ) {
    throw new Error("Invalid access token payload");
  }

  return decoded as unknown as JwtPayload;
}

export function verifyRefreshToken(
  token: string
): JwtPayload {
  const decoded = jwt.verify(
    token,
    REFRESH_TOKEN_SECRET
  );

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded) ||
    !("email" in decoded) ||
    !("role" in decoded)
  ) {
    throw new Error("Invalid refresh token payload");
  }

  return decoded as unknown as JwtPayload;
}