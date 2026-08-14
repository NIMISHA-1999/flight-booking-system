"use strict";
// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));
// app.get("/", (_req, res) => {
//   res.json({
//     success: true,
//     message: "Flight Booking API",
//   });
// });
// app.get("/api/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Server is running",
//   });
// });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
require("dotenv/config");
const app_js_1 = __importDefault(require("./app.js"));
const PORT = process.env.PORT || 4000;
app_js_1.default.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map