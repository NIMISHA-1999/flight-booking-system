"use strict";
// src/routes/admin.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
/*
 * =====================================================
 * ADMIN AUTHENTICATION
 * =====================================================
 *
 * Every admin route requires:
 *
 * 1. Valid JWT
 * 2. ADMIN role
 *
 * =====================================================
 */
router.use(auth_middleware_1.authMiddleware);
router.use(role_middleware_1.requireAdmin);
/*
 * =====================================================
 * DASHBOARD
 * =====================================================
 */
router.get("/dashboard", admin_controller_1.getDashboardStats);
/*
 * =====================================================
 * BOOKINGS
 * =====================================================
 */
router.get("/bookings", admin_controller_1.getAllBookings);
router.patch("/bookings/:bookingId/cancel", admin_controller_1.cancelBooking);
/*
 * =====================================================
 * FLIGHTS
 * =====================================================
 */
router.get("/flights", admin_controller_1.getFlights);
router.post("/flights", admin_controller_1.createFlight);
router.patch("/flights/:flightId", admin_controller_1.updateFlight);
router.delete("/flights/:flightId", admin_controller_1.deleteFlight);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map