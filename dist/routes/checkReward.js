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
exports.ApiCheckReward = void 0;
const api_1 = require("../api");
const authorization_1 = require("../middleware/authorization");
const Default_1 = require("../helpers/Default");
const Helpers = new Default_1.HelperController();
class ApiCheckReward {
    constructor() {
        this.getCheckRewardId = (url, middleware, roles) => {
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
        this.getCheckRewardMe = (url, middleware, roles) => {
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
        this.getCheckRewardAll = (url, middleware, roles) => {
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
        this.addCheckReward = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        this.updateCheckReward = (url, middleware, roles) => {
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
        this.deleteCheckReward = (url, middleware, roles) => {
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
exports.ApiCheckReward = ApiCheckReward;
