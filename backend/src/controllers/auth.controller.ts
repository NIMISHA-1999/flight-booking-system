import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";

      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed";

      return res.status(401).json({
        success: false,
        message,
      });
    }
  }
}

export default new AuthController();