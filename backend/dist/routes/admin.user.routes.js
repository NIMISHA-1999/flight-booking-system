"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_user_controller_1 = require("../controllers/admin.user.controller");
const router = (0, express_1.Router)();
router.get("/", admin_user_controller_1.getAdminUsers);
exports.default = router;
//# sourceMappingURL=admin.user.routes.js.map