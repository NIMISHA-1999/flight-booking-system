export interface JwtPayload {
    userId: string;
    email: string;
    role: "USER" | "ADMIN";
}
export declare function generateAccessToken(payload: JwtPayload): never;
export declare function generateRefreshToken(payload: JwtPayload): never;
export declare function verifyAccessToken(token: string): JwtPayload;
export declare function verifyRefreshToken(token: string): JwtPayload;
//# sourceMappingURL=jwt.d.ts.map