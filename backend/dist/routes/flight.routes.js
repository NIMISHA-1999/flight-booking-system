"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const flight_controller_1 = require("../controllers/flight.controller");
const router = (0, express_1.Router)();
// Get all flights
router.get("/", flight_controller_1.getAllFlights);
// Search flights
router.get("/search", flight_controller_1.searchFlights);
router.get("/:id", flight_controller_1.getFlightById);
exports.default = router;
//# sourceMappingURL=flight.routes.js.map