import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(helmet());
app.use(morgan("dev"));

/*
 * =====================================================
 * STRIPE WEBHOOK
 * =====================================================
 *
 * IMPORTANT:
 * This MUST come before express.json().
 *
 * Stripe requires the original/raw request body
 * to verify the stripe-signature.
 */
app.use(
  "/api/stripe/webhook",
  express.raw({
    type: "application/json",
  }),
);

/*
 * =====================================================
 * NORMAL REQUEST BODY
 * =====================================================
 */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/*
 * =====================================================
 * HEALTH
 * =====================================================
 */

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Flight Booking API",
  });
});

/*
 * =====================================================
 * API ROUTES
 * =====================================================
 */

app.use("/api", routes);

export default app;