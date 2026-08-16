import { Router } from "express";
import { getAdminUsers } from "../controllers/admin.user.controller";

const router = Router();

router.get("/", getAdminUsers);

export default router;