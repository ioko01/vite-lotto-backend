"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOption = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.PORT = process.env.PORT || 8000;
exports.corsOption = {
    origin: process.env.VITE_OPS_URL,
    credentials: true,
};
