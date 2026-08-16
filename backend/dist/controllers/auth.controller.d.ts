import { Request, Response } from "express";
declare class AuthController {
    /**
     * =====================================================
     * REGISTER
     * =====================================================
     */
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * =====================================================
     * LOGIN
     * =====================================================
     */
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * =====================================================
     * REFRESH
     * =====================================================
     */
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * =====================================================
     * LOGOUT
     * =====================================================
     */
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map