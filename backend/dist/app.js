"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const stripe_webhook_routes_1 = __importDefault(require("./routes/stripe-webhook.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
// =====================================================
// STRIPE WEBHOOK
// MUST BE BEFORE express.json()
// =====================================================
app.use("/api/stripe", express_1.default.raw({
    type: "application/json",
}), stripe_webhook_routes_1.default);
// =====================================================
// NORMAL BODY PARSER
// =====================================================
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
app.use("/api", routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map