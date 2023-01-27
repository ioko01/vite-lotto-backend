"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GMT = void 0;
function GMT(number = 7) {
    return new Date(Date.now() + 1000 * 60 * 60 * number);
}
exports.GMT = GMT;
