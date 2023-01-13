"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const Bill_1 = __importDefault(require("./helpers/Bill"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const APP = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const corsOption = {
    origin: "http://127.0.0.1:5173",
};
APP.use((0, cors_1.default)());
APP.use(body_parser_1.default.json());
APP.get('/getbill', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield Bill_1.default.get();
    snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage });
}));
APP.post('/addbill', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    yield Bill_1.default.add(data);
    res.send({ statusCode: req.statusCode, message: req.statusMessage });
}));
APP.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
