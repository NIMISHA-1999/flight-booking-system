export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface JwtUser {
    userId: string;
    email: string;
    role: string;
}
//# sourceMappingURL=auth.types.d.ts.map