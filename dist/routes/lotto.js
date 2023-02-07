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
exports.ApiLotto = void 0;
const api_1 = require("../api");
const authorization_1 = require("../middleware/authorization");
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase/firestore");
const time_1 = require("../utils/time");
const Default_1 = require("../helpers/Default");
const Helpers = new Default_1.HelperController();
class ApiLotto {
    constructor() {
        this.getLottoId = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.params;
                            const lotto = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBLottos, data.id));
                            if (!lotto)
                                return res.status(400).json({ message: "don't have lotto" });
                            return res.json(lotto);
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
        this.getLottoMe = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const q = (0, firestore_1.query)(firebase_1.lottosCollectionRef, (0, firestore_1.where)("user_create_id", "==", authorize.id));
                            const lotto = yield Helpers.getContain(q);
                            if (!lotto)
                                return res.status(400).json({ message: "don't have lotto" });
                            return res.json(lotto);
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
        this.getLottoAll = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const lotto = yield Helpers.getAll(firebase_1.lottosCollectionRef);
                            if (!lotto)
                                return res.status(400).json({ message: "don't have lotto" });
                            return res.json(lotto);
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
        this.addLotto = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            const lotto = {
                                name: data.name,
                                img_flag: data.img_flag,
                                open: data.open,
                                close: data.close,
                                report: data.report,
                                status: data.status,
                                created_at: (0, time_1.GMT)(),
                                updated_at: (0, time_1.GMT)(),
                                user_create_id: authorize.id
                            };
                            yield Helpers.add(firebase_1.lottosCollectionRef, lotto)
                                .then(() => {
                                return res.send({ statusCode: res.statusCode, message: "OK" });
                            })
                                .catch(() => {
                                return res.status(400).json({ message: "add lotto unsuccessfully" });
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
        this.updateLotto = (url, middleware, roles) => {
            api_1.router.put(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                }
                catch (error) {
                    res.status(res.statusCode).send(error);
                }
            }));
        };
        this.deleteLotto = (url, middleware, roles) => {
            api_1.router.delete(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            yield Helpers.delete(data.id, firebase_1.DBLottos)
                                .then((data) => {
                                if (data === 400)
                                    return res.status(400).json({ message: "don't have lotto" });
                                return res.send({ statusCode: res.statusCode, message: "OK" });
                            })
                                .catch(() => {
                                return res.status(400).json({ message: "delete lotto unsuccessfully" });
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
    }
}
exports.ApiLotto = ApiLotto;
