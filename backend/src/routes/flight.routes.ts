import { Router } from "express";
import {
  getAllFlights,
  searchFlights,
} from "../controllers/flight.controller";

const router = Router();

// Get all flights
router.get("/", getAllFlights);

// Search flights
router.get("/search", searchFlights);

export default router;