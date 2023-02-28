"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digitCloseHandler = void 0;
const api_1 = require("../api");
const digitCloseHandler = (socket) => {
    const createDigitClose = () => {
        api_1.io.emit("get_digit_close");
    };
    socket.on("create_digit_close", createDigitClose);
};
exports.digitCloseHandler = digitCloseHandler;
