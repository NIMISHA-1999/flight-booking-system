import { Router } from "express";
import {
  getAllFlights,
  searchFlights,
  getFlightById,
} from "../controllers/flight.controller";

const router = Router();

// Get all flights
router.get("/", getAllFlights);

// Search flights
router.get("/search", searchFlights);
router.get("/:id", getFlightById);

export default router;