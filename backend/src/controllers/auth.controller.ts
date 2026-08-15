// src/controllers/auth.controller.ts

import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
  /**
   * =====================================================
   * REGISTER
   * =====================================================
   */
  async register(req: Request, res: Response) {
    try {
      console.log("REGISTER BODY:", req.body);

      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body ?? {};

      if (
        !firstName?.trim() ||
        !lastName?.trim() ||
        !email?.trim() ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "First name, last name, email and password are required",
        });
      }

      const result =
        await authService.register({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email
            .trim()
            .toLowerCase(),
          password,
        });

      return res.status(201).json({
        success: true,
        message:
          "User registered successfully",
        data: result,
      });
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error,
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Registration failed",
      });
    }
  }

  /**
   * =====================================================
   * LOGIN
   * =====================================================
   */
  async login(req: Request, res: Response) {
    try {
      console.log(
        "LOGIN BODY:",
        {
          email: req.body?.email,
          password:
            req.body?.password
              ? "***"
              : undefined,
        },
      );

      const {
        email,
        password,
      } = req.body ?? {};

      if (
        !email?.trim() ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required",
        });
      }

      const result =
        await authService.login({
          email: email
            .trim()
            .toLowerCase(),
          password,
        });

      console.log(
        "LOGIN SUCCESS:",
        {
          userId: result.user?.id,
          email: result.user?.email,
          role: result.user?.role,
          hasAccessToken:
            !!result.accessToken,
          hasRefreshToken:
            !!result.refreshToken,
        },
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error,
      );

      return res.status(401).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Invalid email or password",
      });
    }
  }

  /**
   * =====================================================
   * REFRESH
   * =====================================================
   */
  async refresh(
    req: Request,
    res: Response,
  ) {
    try {
      const {
        refreshToken,
      } = req.body ?? {};

      if (
        !refreshToken ||
        typeof refreshToken !==
          "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Refresh token is required",
        });
      }

      const result =
        await authService.refresh(
          refreshToken,
        );

      return res.status(200).json({
        success: true,
        message:
          "Token refreshed successfully",
        data: result,
      });
    } catch (error) {
      console.error(
        "REFRESH ERROR:",
        error,
      );

      return res.status(401).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to refresh token",
      });
    }
  }

  /**
   * =====================================================
   * LOGOUT
   * =====================================================
   */
  async logout(
    req: Request,
    res: Response,
  ) {
    try {
      const {
        refreshToken,
      } = req.body ?? {};

      if (
        !refreshToken ||
        typeof refreshToken !==
          "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Refresh token is required",
        });
      }

      await authService.logout(
        refreshToken,
      );

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error,
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Logout failed",
      });
    }
  }
}

export default new AuthController();