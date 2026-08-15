// src/middleware/roleMiddleware.ts

import {
  Response,
  NextFunction,
} from "express";

import {
  AuthenticatedRequest,
} from "../types/auth.types";

/*
 * =====================================================
 * REQUIRE ADMIN
 * =====================================================
 *
 * This middleware must be used AFTER authMiddleware.
 *
 * Example:
 *
 * router.get(
 *   "/dashboard",
 *   authMiddleware,
 *   requireAdmin,
 *   getDashboardStats,
 * );
 *
 * =====================================================
 */

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(
      "\n========== ADMIN ROLE CHECK ==========",
    );

    /*
     * =================================================
     * CHECK AUTHENTICATED USER
     * =================================================
     */

    if (!req.user) {
      console.log(
        "ROLE CHECK FAILED: User not authenticated",
      );

      return res.status(401).json({
        success: false,
        message: "Authentication required.",
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    console.log(
      "Authenticated User:",
      req.user.userId,
    );

    console.log(
      "User Role:",
      req.user.role,
    );

    /*
     * =================================================
     * CHECK ROLE
     * =================================================
     */

    if (
      !req.user.role ||
      req.user.role.toUpperCase() !== "ADMIN"
    ) {
      console.log(
        "ROLE CHECK FAILED: Admin access denied",
      );

      return res.status(403).json({
        success: false,
        message: "Admin access required.",
        code: "ADMIN_ACCESS_REQUIRED",
      });
    }

    /*
     * =================================================
     * ADMIN AUTHORIZED
     * =================================================
     */

    console.log(
      "ROLE CHECK SUCCESS: Admin authorized",
    );

    console.log(
      "======================================\n",
    );

    return next();
  } catch (error) {
    console.error(
      "ADMIN ROLE MIDDLEWARE ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify admin authorization.",
      code: "ROLE_CHECK_FAILED",
    });
  }
};