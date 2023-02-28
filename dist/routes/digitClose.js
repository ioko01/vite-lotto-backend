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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDigitClose = void 0;
const api_1 = require("../api");
const authorization_1 = require("../middleware/authorization");
const Default_1 = require("../helpers/Default");
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase/firestore");
const time_1 = require("../utils/time");
const Helpers = new Default_1.HelperController();
class ApiDigitClose {
    constructor() {
        this.getDigitCloseId = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.params;
                            const q = (0, firestore_1.query)(firebase_1.digitsCloseCollectionRef, (0, firestore_1.where)("lotto_id", "==", data.id));
                            const [digitClose] = yield Helpers.getContain(q);
                            if (!digitClose)
                                return res.status(400).json({ message: "don't have digit close" });
                            return res.json(digitClose);
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
                    }
                    else {
                        return res.sendStatus(401);
                    }
                }
                catch (err) {
                    if (err.code === 11000) {
                        return res.status(409).json({
                            status: 'fail',
                            message: 'username already exist',
                        });
                    }
                }
            }));
        };
        this.getDigitCloseMe = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const q = (0, firestore_1.query)(firebase_1.digitsCloseCollectionRef, (0, firestore_1.where)("user_create_id", "==", authorize.id));
                            const digitClose = yield Helpers.getContain(q);
                            if (!digitClose)
                                return res.status(400).json({ message: "don't have digit close" });
                            return res.json(digitClose);
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
                    }
                    else {
                        return res.sendStatus(401);
                    }
                }
                catch (err) {
                    if (err.code === 11000) {
                        return res.status(409).json({
                            status: 'fail',
                            message: 'username already exist',
                        });
                    }
                }
            }));
        };
        this.getDigitCloseAll = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
                    }
                    else {
                        return res.sendStatus(401);
                    }
                }
                catch (err) {
                    if (err.code === 11000) {
                        return res.status(409).json({
                            status: 'fail',
                            message: 'username already exist',
                        });
                    }
                }
            }));
        };
        this.addDigitClose = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            const q = (0, firestore_1.query)(firebase_1.digitsCloseCollectionRef, (0, firestore_1.where)("lotto_id", "==", data.lotto_id), (0, firestore_1.where)("rate_id", "==", data.rate_id), (0, firestore_1.where)("store_id", "==", data.store_id));
                            const isStore = yield Helpers.getContain(q);
                            if (isStore.length > 0)
                                return res.status(400).json({ message: "this digit close has been used" });
                            const digitClose = {
                                lotto_id: data.lotto_id,
                                percent: data.percent,
                                rate_id: data.rate_id,
                                store_id: data.store_id,
                                one_digits: data.one_digits,
                                two_digits: data.two_digits,
                                three_digits: data.three_digits,
                                user_create_id: authorize.id,
                                created_at: (0, time_1.GMT)(),
                                updated_at: (0, time_1.GMT)(),
                            };
                            yield Helpers.add(firebase_1.digitsCloseCollectionRef, digitClose)
                                .then(() => {
                                res.send({ statusCode: res.statusCode, message: "OK" });
                            })
                                .catch(error => {
                                res.send({ statusCode: res.statusCode, message: error });
                            });
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
                    }
                    else {
                        return res.sendStatus(401);
                    }
                }
                catch (error) {
                    res.status(res.statusCode).send(error);
                }
            }));
        };
        this.updateDigitClose = (url, middleware, roles) => {
            api_1.router.put(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
                    }
                    else {
                        return res.sendStatus(401);
                    }
                }
                catch (error) {
                    res.status(res.statusCode).send(error);
                }
            }));
        };
        this.deleteDigitClose = (url, middleware, roles) => {
            api_1.router.delete(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
                    }
                    else {
                        return res.sendStatus(401);
                    }
                }
                catch (error) {
                    res.status(res.statusCode).send(error);
                }
            }));
        };
    }
}
exports.ApiDigitClose = ApiDigitClose;
