"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
require("dotenv/config");
const stripe_1 = __importDefault(require("stripe"));
const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing.");
}
console.log("Stripe key loaded:", `${secretKey.substring(0, 12)}...`);
exports.stripe = new stripe_1.default(secretKey);
//# sourceMappingURL=stripe.js.map