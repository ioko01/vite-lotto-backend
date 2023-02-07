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
exports.ApiBill = void 0;
const api_1 = require("../api");
const authorization_1 = require("../middleware/authorization");
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase/firestore");
const time_1 = require("../utils/time");
const Default_1 = require("../helpers/Default");
const Helpers = new Default_1.HelperController();
class ApiBill {
    constructor() {
        this.getBillAllMe = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const { id } = req.params;
                            let q = undefined;
                            if (authorize.role === "ADMIN") {
                                q = (0, firestore_1.query)(firebase_1.billsCollectionRef, (0, firestore_1.where)((0, firestore_1.documentId)(), "==", id));
                            }
                            else if (authorize.role === "AGENT") {
                                q = (0, firestore_1.query)(firebase_1.billsCollectionRef, (0, firestore_1.where)("agent_create_id", "==", authorize.id));
                            }
                            else if (authorize.role === "MANAGER") {
                                q = (0, firestore_1.query)(firebase_1.billsCollectionRef, (0, firestore_1.where)("agent_create_id", "==", authorize.agent_create_id), (0, firestore_1.where)("manager_create_id", "==", authorize.id));
                            }
                            if (!q)
                                return res.sendStatus(403);
                            const bill = yield Helpers.getContain(q);
                            if (bill.length === 0)
                                return res.status(400).json({ message: "don't have bill" });
                            return res.json(bill);
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
        this.getBillMe = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const q = (0, firestore_1.query)(firebase_1.billsCollectionRef, (0, firestore_1.where)("user_create_id", "==", authorize.id));
                            const bill = yield Helpers.getContain(q);
                            if (!bill)
                                return res.status(400).json({ message: "don't have bill" });
                            return res.json(bill);
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
        this.getBillAll = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const bill = yield Helpers.getAll(firebase_1.billsCollectionRef);
                            if (!bill)
                                return res.status(400).json({ message: "don't have bill" });
                            return res.json(bill);
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
        this.calculatePrice = (one_digits, two_digits, three_digits) => {
            let one_price_array = [];
            let total = [];
            one_digits === null || one_digits === void 0 ? void 0 : one_digits.map(digit => {
                const top = digit.split(":")[1];
                const bottom = digit.split(":")[2];
                one_price_array.push(parseInt(top));
                one_price_array.push(parseInt(bottom));
            });
            total.push(one_price_array.reduce((price, current) => price + current, 0));
            let two_price_array = [];
            two_digits === null || two_digits === void 0 ? void 0 : two_digits.map(digit => {
                const top = digit.split(":")[1];
                const bottom = digit.split(":")[2];
                two_price_array.push(parseInt(top));
                two_price_array.push(parseInt(bottom));
            });
            total.push(two_price_array.reduce((price, current) => price + current, 0));
            let three_price_array = [];
            three_digits === null || three_digits === void 0 ? void 0 : three_digits.map(digit => {
                const top = digit.split(":")[1];
                const bottom = digit.split(":")[2];
                three_price_array.push(parseInt(top));
                three_price_array.push(parseInt(bottom));
            });
            total.push(three_price_array.reduce((price, current) => price + current, 0));
            const price = total.reduce((price, current) => price + current, 0);
            return price;
        };
        this.addBill = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            if (!data.lotto_id && !data.rate_id && !data.times)
                                return res.sendStatus(403);
                            const rate = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBRates, data.rate_id));
                            const lotto = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBLottos, data.lotto_id));
                            const store = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBStores, data.store_id));
                            if (!rate)
                                return res.status(400).json({ message: "don't have rate" });
                            if (!lotto)
                                return res.status(400).json({ message: "don't have lotto" });
                            if (!store)
                                return res.status(400).json({ message: "don't have store" });
                            if (rate.lotto_id !== data.lotto_id)
                                return res.status(400).json({ message: "don't have rate in store" });
                            const bill = {
                                lotto_id: data.lotto_id,
                                note: data.note,
                                rate_id: data.rate_id,
                                status: "WAIT",
                                store_id: data.store_id,
                                times: data.times,
                                one_digits: data.one_digits,
                                two_digits: data.two_digits,
                                three_digits: data.three_digits,
                                reward: data.reward,
                                created_at: (0, time_1.GMT)(),
                                updated_at: (0, time_1.GMT)(),
                                user_create_id: authorize.id
                            };
                            const price = this.calculatePrice(data.one_digits, data.two_digits, data.three_digits);
                            yield Helpers.add(firebase_1.billsCollectionRef, bill)
                                .then(() => __awaiter(this, void 0, void 0, function* () {
                                if (authorize.credit < price)
                                    return res.status(400).json({ message: "no credit" });
                                yield Helpers.update(authorize.id, firebase_1.DBUsers, { credit: authorize.credit - price })
                                    .then(() => {
                                    res.send({ statusCode: res.statusCode, message: "OK" });
                                })
                                    .catch(() => {
                                    return res.status(400).json({ message: "update credit unsuccessfully" });
                                });
                            }))
                                .catch(() => {
                                return res.status(400).json({ message: "add bill unsuccessfully" });
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
        // updateBill = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        //     router.put(url, middleware, async (req: Request, res: Response) => {
        //         try {
        //             const data = req.body
        //             await Helpers.update("1", DBBills, data)
        //                 .then(() => {
        //                     res.send({ statusCode: res.statusCode, message: "OK" })
        //                 })
        //                 .catch(error => {
        //                     res.send({ statusCode: res.statusCode, message: error })
        //                 })
        //         } catch (error) {
        //             res.status(res.statusCode).send(error);
        //         }
        //     })
        // }
        this.deleteBill = (url, middleware, roles) => {
            api_1.router.put(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            const q = (0, firestore_1.query)(firebase_1.billsCollectionRef, (0, firestore_1.where)("user_create_id", "==", authorize.id), (0, firestore_1.where)((0, firestore_1.documentId)(), "==", data.id));
                            const isBillMe = yield Helpers.getContain(q);
                            if (isBillMe.length <= 0)
                                return res.sendStatus(403);
                            const [price] = isBillMe.map(bill => {
                                if (bill.status === "CANCEL" || bill.status === "REWARD")
                                    return false;
                                const price = this.calculatePrice(bill.one_digits, bill.two_digits, bill.three_digits);
                                return price;
                            });
                            if (!price)
                                return res.status(400).json({ message: "can not delete bill" });
                            yield Helpers.update(data.id, firebase_1.DBBills, { status: "CANCEL" })
                                .then(() => __awaiter(this, void 0, void 0, function* () {
                                yield Helpers.update(authorize.id, firebase_1.DBUsers, { credit: authorize.credit + price })
                                    .then(() => {
                                    res.send({ statusCode: res.statusCode, message: "OK" });
                                })
                                    .catch(() => {
                                    return res.status(400).json({ message: "update credit unsuccessfully" });
                                });
                            }))
                                .catch(error => {
                                return res.status(400).json({ message: "delete bill unsuccessfully" });
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
exports.ApiBill = ApiBill;
