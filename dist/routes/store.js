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
exports.ApiStore = void 0;
const api_1 = require("../api");
const authorization_1 = require("../middleware/authorization");
const Default_1 = require("../helpers/Default");
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase/firestore");
const time_1 = require("../utils/time");
const Helpers = new Default_1.HelperController();
class ApiStore {
    constructor() {
        this.getStoreAllMe = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const { id } = req.params;
                            console.log(id, authorize.id);
                            const q = (0, firestore_1.query)(firebase_1.storesCollectionRef, (0, firestore_1.where)("user_create_id", "==", authorize.id), (0, firestore_1.where)((0, firestore_1.documentId)(), "==", id));
                            const store = yield Helpers.getContain(q);
                            if (store.length === 0)
                                return res.status(400).json({ message: "don't have store" });
                            return res.json(store);
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
        this.getStoreMe = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            let q = undefined;
                            if (authorize.role === "ADMIN") {
                                q = (0, firestore_1.query)(firebase_1.storesCollectionRef);
                            }
                            else if (authorize.role === "AGENT") {
                                q = (0, firestore_1.query)(firebase_1.storesCollectionRef, (0, firestore_1.where)("user_create_id", "==", authorize.id));
                            }
                            else if (authorize.role === "MANAGER" || authorize.role === "MANAGE_REWARD" || authorize.role === "MEMBER") {
                                q = (0, firestore_1.query)(firebase_1.storesCollectionRef, (0, firestore_1.where)((0, firestore_1.documentId)(), "==", authorize.store_id));
                            }
                            if (!q)
                                return res.sendStatus(403);
                            const store = yield Helpers.getContain(q);
                            if (!store)
                                return res.status(400).json({ message: "don't have store" });
                            return res.json(store);
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
        this.getStoreAll = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const store = yield Helpers.getAll(firebase_1.storesCollectionRef);
                            if (!store)
                                return res.status(400).json({ message: "don't have store" });
                            return res.json(store);
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
        this.addStore = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            const q = (0, firestore_1.query)(firebase_1.storesCollectionRef, (0, firestore_1.where)("name", "==", data.name));
                            const isStore = yield Helpers.getContain(q);
                            if (isStore.length > 0)
                                return res.status(400).json({ message: "this store has been used" });
                            const store = {
                                img_logo: data.img_logo,
                                name: data.name,
                                created_at: (0, time_1.GMT)(),
                                updated_at: (0, time_1.GMT)(),
                                user_create_id: authorize.id
                            };
                            yield Helpers.add(firebase_1.storesCollectionRef, store)
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
        this.updateStore = (url, middleware, roles) => {
            api_1.router.put(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            yield Helpers.update("1", firebase_1.DBStores, data)
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
        this.deleteStore = (url, middleware, roles) => {
            api_1.router.delete(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            yield Helpers.delete(data.id, firebase_1.DBStores)
                                .then((data) => {
                                if (data === 400)
                                    return res.status(400).json({ message: "don't have store" });
                                return res.send({ statusCode: res.statusCode, message: "OK" });
                            })
                                .catch(error => {
                                return res.send({ statusCode: res.statusCode, message: error });
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
exports.ApiStore = ApiStore;
