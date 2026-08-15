"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = (0, express_1.Router)();
router.post("/register", (req, res) => auth_controller_1.default.register(req, res));
router.post("/login", (req, res) => auth_controller_1.default.login(req, res));
router.post("/refresh", (req, res) => auth_controller_1.default.refresh(req, res));
router.post("/logout", (req, res) => auth_controller_1.default.logout(req, res));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map