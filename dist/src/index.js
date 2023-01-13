"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const APP = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const corsOption = {
    origin: "http://127.0.0.1:5173",
};
APP.use(body_parser_1.default.json());
APP.use((0, cors_1.default)(corsOption));
APP.post('/addbill', (req, res) => {
    console.log(req.body);
});
APP.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
