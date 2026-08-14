import { RegisterDto, LoginDto } from "../types/auth.types";
export declare class AuthService {
    register(data: RegisterDto): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: import("../generated/prisma/enums").UserRole;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(data: LoginDto): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: import("../generated/prisma/enums").UserRole;
        };
        accessToken: string;
        refreshToken: string;
    }>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map