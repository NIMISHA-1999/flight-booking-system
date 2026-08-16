"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_webhook_controller_1 = require("../controllers/stripe-webhook.controller");
const router = (0, express_1.Router)();
router.post("/webhook", stripe_webhook_controller_1.stripeWebhook);
exports.default = router;
//# sourceMappingURL=stripe-webhook.routes.js.map