"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cancellation_controller_1 = require("../controllers/cancellation.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/:bookingId/cancel", auth_middleware_1.authMiddleware, cancellation_controller_1.cancelBooking);
exports.default = router;
//# sourceMappingURL=cancellation.routes.js.map