interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}
export declare const generateAccessToken: (payload: JwtPayload) => string;
export declare const generateRefreshToken: (payload: JwtPayload) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload;
export declare const verifyRefreshToken: (token: string) => JwtPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map