import { Router } from "express";

import {
  getAdminUsers,
} from "../controllers/admin.user.controller";

import {
  authMiddleware,
} from "../middleware/auth.middleware";

const router = Router();

/*
 * GET /api/admin/users
 *
 * Examples:
 *
 * /api/admin/users
 * /api/admin/users?page=1&limit=10
 * /api/admin/users?page=1&limit=10&search=john
 * /api/admin/users?page=1&limit=10&role=USER
 * /api/admin/users?page=1&limit=10&role=ADMIN
 */

router.get(
  "/users",
  authMiddleware,
  getAdminUsers,
);

export default router;