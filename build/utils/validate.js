"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateUsername = void 0;
const validateUsername = (username) => {
    const formatUsername = username.trim();
    return formatUsername.length > 5 && formatUsername.length < 13;
};
exports.validateUsername = validateUsername;
const validatePassword = (password) => password.length > 7 && password.length < 17;
exports.validatePassword = validatePassword;
