import { RegisterDto, LoginDto } from "../types/auth.types";
export declare class AuthService {
    /**
     * Hash refresh token before storing it in DB.
     * We never store the raw refresh token.
     */
    private hashRefreshToken;
    /**
     * Store refresh token in database.
     */
    private saveRefreshToken;
    /**
     * Register
     */
    register(data: RegisterDto): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: import("../generated/prisma/enums").UserRole;
        };
        accessToken: never;
        refreshToken: never;
    }>;
    /**
     * Login
     */
    login(data: LoginDto): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: import("../generated/prisma/enums").UserRole;
        };
        accessToken: never;
        refreshToken: never;
    }>;
    /**
     * Refresh access token.
     *
     * Old refresh token is revoked and
     * a new refresh token is generated.
     */
    refresh(refreshToken: string): Promise<{
        accessToken: never;
        refreshToken: never;
    }>;
    /**
     * Logout.
     *
     * Revoke the refresh token in database.
     */
    logout(refreshToken: string): Promise<void>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map