import express from "express";
import cors from "cors";

import routes from "./routes";
import stripeWebhookRoutes from "./routes/stripe-webhook.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// =====================================================
// STRIPE WEBHOOK
// MUST BE BEFORE express.json()
// =====================================================

app.use(
  "/api/stripe",
  express.raw({
    type: "application/json",
  }),
  stripeWebhookRoutes,
);

// =====================================================
// NORMAL BODY PARSER
// =====================================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Flight Booking API",
  });
});

// =====================================================
// NORMAL API ROUTES
// =====================================================

app.use("/api", routes);

export default app;