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
exports.ApiRate = void 0;
const api_1 = require("../api");
const authorization_1 = require("../middleware/authorization");
const Default_1 = require("../helpers/Default");
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase/firestore");
const time_1 = require("../utils/time");
const Helpers = new Default_1.HelperController();
class ApiRate {
    constructor() {
        this.getRateAllMe = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            let q = undefined;
                            if (authorize.role === "ADMIN") {
                                q = (0, firestore_1.query)(firebase_1.ratesCollectionRef);
                            }
                            else if (authorize.role === "AGENT") {
                                q = (0, firestore_1.query)(firebase_1.ratesCollectionRef, (0, firestore_1.where)("user_create_id", "==", authorize.id));
                            }
                            if (!q)
                                return res.sendStatus(403);
                            const rate = yield Helpers.getContain(q);
                            if (rate.length === 0)
                                return res.status(400).json({ message: "don't have rate" });
                            return res.json(rate);
                        }
                        return res.sendStatus(authorize);
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
        this.getRateMe = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const q = (0, firestore_1.query)(firebase_1.ratesCollectionRef, (0, firestore_1.where)("user_create_id", "==", authorize.agent_create_id));
                            const rate = yield Helpers.getContain(q);
                            if (!rate)
                                return res.status(400).json({ message: "don't have rate" });
                            return res.json(rate);
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
        this.getRateAll = (url, middleware, roles) => {
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
        this.addRate = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            if (authorize.role === "AGENT") {
                                const data = req.body;
                                const lotto = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBLottos, data.lotto_id));
                                const store = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBStores, data.store_id));
                                if (!lotto)
                                    return res.status(400).json({ message: "don't have lotto" });
                                if (!store)
                                    return res.status(400).json({ message: "don't have store" });
                                const q = (0, firestore_1.query)(firebase_1.ratesCollectionRef, (0, firestore_1.where)("store_id", "==", data.store_id), (0, firestore_1.where)("lotto_id", "==", data.lotto_id));
                                const checkRate = yield Helpers.getContain(q);
                                if (checkRate.length > 0)
                                    return res.status(400).json({ message: "this rate has been used" });
                                const rate = {
                                    bet_one_digits: data.bet_one_digits,
                                    bet_two_digits: data.bet_two_digits,
                                    bet_three_digits: data.bet_three_digits,
                                    one_digits: data.one_digits,
                                    two_digits: data.two_digits,
                                    three_digits: data.three_digits,
                                    store_id: data.store_id,
                                    lotto_id: data.lotto_id,
                                    admin_create_id: authorize.admin_create_id,
                                    created_at: (0, time_1.GMT)(),
                                    updated_at: (0, time_1.GMT)(),
                                    user_create_id: authorize.id,
                                    committion: data.committion
                                };
                                yield Helpers.add(firebase_1.ratesCollectionRef, rate)
                                    .then(() => {
                                    return res.send({ statusCode: res.statusCode, message: "OK" });
                                })
                                    .catch(error => {
                                    return res.send({ statusCode: res.statusCode, message: error });
                                });
                            }
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
        this.updateRate = (url, middleware, roles) => {
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
        this.deleteRate = (url, middleware, roles) => {
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
exports.ApiRate = ApiRate;
