"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateKey = exports.publicKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
_a = crypto_1.default.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicExponent: 3,
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
}), exports.publicKey = _a.publicKey, exports.privateKey = _a.privateKey;
