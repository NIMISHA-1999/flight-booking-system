import "dotenv/config";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is missing.");
}

console.log(
  "Stripe key loaded:",
  `${secretKey.substring(0, 12)}...`,
);

export const stripe: Stripe = new Stripe(secretKey);