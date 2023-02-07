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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUser = void 0;
const api_1 = require("../api");
const firestore_1 = require("firebase/firestore");
const validate_1 = require("../utils/validate");
const User_1 = require("../models/User");
const firebase_1 = require("../utils/firebase");
const bcrypt_1 = __importDefault(require("bcrypt"));
const time_1 = require("../utils/time");
const authenticate_1 = require("../middleware/authenticate");
const dotenv_1 = require("dotenv");
const Default_1 = require("../helpers/Default");
const authorization_1 = require("../middleware/authorization");
(0, dotenv_1.config)();
const Helpers = new Default_1.HelperController();
class ApiUser {
    constructor() {
        this.getMe = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const isMe = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBUsers, authorize.id));
                            if (!isMe)
                                return res.status(400).json({ message: "don't have user" });
                            // return res.json(isMe)
                            return res.json(isMe);
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
                    }
                }
                catch (err) {
                    res.send(err);
                }
            }));
        };
        this.getUserAllMe = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            let q = undefined;
                            if (authorize.role === "ADMIN") {
                                q = (0, firestore_1.query)(firebase_1.usersCollectionRef);
                            }
                            else if (authorize.role === "AGENT") {
                                q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("agent_create_id", "==", authorize.id));
                            }
                            else if (authorize.role === "MANAGER") {
                                q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("agent_create_id", "==", authorize.agent_create_id), (0, firestore_1.where)("manager_create_id", "==", authorize.id));
                            }
                            if (!q)
                                return res.sendStatus(403);
                            const isUserMe = yield Helpers.getContain(q);
                            if (isUserMe.length === 0)
                                return res.status(400).json({ message: "don't have user" });
                            return res.json(isUserMe);
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
                    }
                }
                catch (err) {
                    res.send(err);
                }
            }));
        };
        this.getUserAll = (url, middleware, roles) => {
            api_1.router.get(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const user = yield Helpers.getAll(firebase_1.usersCollectionRef);
                            if (!user)
                                return res.status(400).json({ message: "don't have user" });
                            return res.json(user);
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
                    }
                }
                catch (err) {
                    res.send(err);
                }
            }));
        };
        this.credit = (url, middleware, roles) => {
            api_1.router.put(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            const user = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBUsers, data.id));
                            if (req.params.excute === "remove" && user.credit - data.credit < 0)
                                return res.sendStatus(403);
                            let creditMe = 0;
                            let credit = 0;
                            if (req.params.excute === "add") {
                                if (authorize.role === "ADMIN" || authorize.role === "AGENT") {
                                    credit = user.credit + data.credit;
                                }
                                else if (authorize.role === "MANAGER") {
                                    if (authorize.credit - data.credit >= 0) {
                                        creditMe = authorize.credit - data.credit;
                                        credit = user.credit + data.credit;
                                    }
                                    else {
                                        return res.sendStatus(403);
                                    }
                                }
                                else {
                                    return res.sendStatus(403);
                                }
                            }
                            if (req.params.excute === "remove") {
                                if (authorize.role === "ADMIN" || authorize.role === "AGENT") {
                                    credit = user.credit - data.credit;
                                }
                                else if (authorize.role === "MANAGER") {
                                    creditMe = authorize.credit + data.credit;
                                    credit = user.credit - data.credit;
                                }
                            }
                            let q = undefined;
                            if (authorize.role === "ADMIN") {
                                q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("1", "==", "1"));
                            }
                            else if (authorize.role === "AGENT") {
                                q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("agent_create_id", "==", authorize.id));
                            }
                            else if (authorize.role === "MANAGER") {
                                q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("agent_create_id", "==", authorize.agent_create_id), (0, firestore_1.where)("manager_create_id", "==", authorize.id));
                            }
                            if (!q)
                                return res.sendStatus(400);
                            const isUserMe = yield Helpers.getContain(q);
                            if (isUserMe.length > 0) {
                                if (authorize.role === "ADMIN" || authorize.role === "AGENT") {
                                    yield Helpers.update(data.id, firebase_1.DBUsers, { credit })
                                        .then(() => {
                                        return res.send({ statusCode: res.statusCode, message: "OK" });
                                    })
                                        .catch(error => {
                                        return res.send({ statusCode: res.statusCode, message: error });
                                    });
                                }
                                else if (authorize.role === "MANAGER") {
                                    yield Helpers.update(authorize.id, firebase_1.DBUsers, { credit: creditMe })
                                        .then(() => __awaiter(this, void 0, void 0, function* () {
                                        yield Helpers.update(data.id, firebase_1.DBUsers, { credit })
                                            .then(() => {
                                            return res.send({ statusCode: res.statusCode, message: "OK" });
                                        })
                                            .catch(error => {
                                            return res.send({ statusCode: res.statusCode, message: error });
                                        });
                                    }))
                                        .catch(error => {
                                        return res.send({ statusCode: res.statusCode, message: error });
                                    });
                                }
                            }
                            return res.sendStatus(403);
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
        this.updateStatus = (url, middleware, roles) => {
            api_1.router.put(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            yield Helpers.update(data.id, firebase_1.DBUsers, { status: data.status })
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
        this.statusAgent = (url, middleware, roles) => {
            this.updateStatus(url, middleware, roles);
        };
        this.statusManager = (url, middleware, roles) => {
            this.updateStatus(url, middleware, roles);
        };
        this.statusMember = (url, middleware, roles) => {
            this.updateStatus(url, middleware, roles);
        };
        this.addUserAdmin = (url) => {
            api_1.router.post(url, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("role", "==", User_1.TUserRoleEnum.ADMIN));
                    const isAdmin = yield (0, firestore_1.getDocs)(q);
                    if (isAdmin.docs.length > 0)
                        return res.sendStatus(401);
                    const data = req.body;
                    const isValidateUsername = (0, validate_1.validateUsername)(data.username);
                    if (!isValidateUsername)
                        throw new Error("username invalid");
                    const isValidatePassword = (0, validate_1.validatePassword)(data.password);
                    if (!isValidatePassword)
                        throw new Error("password invalid");
                    const q2 = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("username", "==", data.username));
                    const { docs } = yield (0, firestore_1.getDocs)(q2);
                    if (docs.length > 0)
                        res.sendStatus(400).send({ message: "this username has been used" });
                    const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
                    const user = {
                        username: data.username,
                        password: hashedPassword,
                        fullname: data.fullname,
                        credit: data.credit,
                        role: "ADMIN",
                        status: "REGULAR",
                        created_at: (0, time_1.GMT)(),
                        updated_at: (0, time_1.GMT)(),
                        tokenVersion: 1
                    };
                    yield Helpers.create(firebase_1.usersCollectionRef, user)
                        .then(() => __awaiter(this, void 0, void 0, function* () {
                        return res.sendStatus(200);
                    }))
                        .catch(error => {
                        return res.send({ statusCode: res.statusCode, message: error });
                    });
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
        this.addUserAgent = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            const isValidateUsername = (0, validate_1.validateUsername)(data.username);
                            if (!isValidateUsername)
                                throw new Error("username invalid");
                            const isValidatePassword = (0, validate_1.validatePassword)(data.password);
                            if (!isValidatePassword)
                                throw new Error("password invalid");
                            const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("username", "==", data.username));
                            const { docs } = yield (0, firestore_1.getDocs)(q);
                            if (docs.length > 0)
                                res.sendStatus(400).send({ message: "this username has been used" });
                            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
                            const user = {
                                username: data.username,
                                password: hashedPassword,
                                fullname: data.fullname,
                                credit: data.credit,
                                role: "AGENT",
                                status: "REGULAR",
                                created_at: (0, time_1.GMT)(),
                                updated_at: (0, time_1.GMT)(),
                                tokenVersion: 1,
                                admin_create_id: authorize.id
                            };
                            yield Helpers.create(firebase_1.usersCollectionRef, user)
                                .then(() => __awaiter(this, void 0, void 0, function* () {
                                return res.sendStatus(200);
                            }))
                                .catch(error => {
                                return res.send({ statusCode: res.statusCode, message: error });
                            });
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
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
        this.addUserManager = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            const isValidateUsername = (0, validate_1.validateUsername)(data.username);
                            if (!isValidateUsername)
                                return res.sendStatus(400).send({ message: "username invalid" });
                            const isValidatePassword = (0, validate_1.validatePassword)(data.password);
                            if (!isValidatePassword)
                                return res.sendStatus(400).send({ message: "password invalid" });
                            const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("username", "==", data.username));
                            const { docs } = yield (0, firestore_1.getDocs)(q);
                            if (docs.length > 0)
                                return res.sendStatus(400).send({ message: "this username has been used" });
                            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
                            if (!data.store_id)
                                return res.status(400).json({ message: "please input store" });
                            const isStore = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBStores, data.store_id));
                            if (!isStore)
                                return res.status(400).json({ message: "don't have store" });
                            const user = {
                                store_id: data.store_id,
                                username: data.username,
                                password: hashedPassword,
                                fullname: data.fullname,
                                credit: data.credit,
                                role: "MANAGER",
                                status: "REGULAR",
                                created_at: (0, time_1.GMT)(),
                                updated_at: (0, time_1.GMT)(),
                                tokenVersion: 1,
                                admin_create_id: authorize.admin_create_id,
                                agent_create_id: authorize.id
                            };
                            yield Helpers.create(firebase_1.usersCollectionRef, user)
                                .then(() => __awaiter(this, void 0, void 0, function* () {
                                return res.sendStatus(200);
                            }))
                                .catch(error => {
                                return res.send({ statusCode: res.statusCode, message: error });
                            });
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
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
        this.addUserMember = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            const isValidateUsername = (0, validate_1.validateUsername)(data.username);
                            if (!isValidateUsername)
                                throw new Error("username invalid");
                            const isValidatePassword = (0, validate_1.validatePassword)(data.password);
                            if (!isValidatePassword)
                                throw new Error("password invalid");
                            const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("username", "==", data.username));
                            const { docs } = yield (0, firestore_1.getDocs)(q);
                            if (docs.length > 0)
                                res.sendStatus(400).send({ message: "this username has been used" });
                            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
                            if (!data.store_id)
                                return res.sendStatus(403);
                            const isStore = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBStores, data.store_id));
                            if (!isStore)
                                return res.sendStatus(403);
                            let user = {};
                            if (authorize.role === "ADMIN" || authorize.role === "AGENT") {
                                user = {
                                    store_id: data.store_id,
                                    username: data.username,
                                    password: hashedPassword,
                                    fullname: data.fullname,
                                    credit: data.credit,
                                    role: "MEMBER",
                                    status: "REGULAR",
                                    created_at: (0, time_1.GMT)(),
                                    updated_at: (0, time_1.GMT)(),
                                    tokenVersion: 1,
                                    admin_create_id: authorize.admin_create_id,
                                    agent_create_id: authorize.agent_create_id
                                };
                            }
                            else if (authorize.role === "MANAGER") {
                                user = {
                                    store_id: data.store_id,
                                    username: data.username,
                                    password: hashedPassword,
                                    fullname: data.fullname,
                                    credit: data.credit,
                                    role: "MEMBER",
                                    status: "REGULAR",
                                    created_at: (0, time_1.GMT)(),
                                    updated_at: (0, time_1.GMT)(),
                                    tokenVersion: 1,
                                    admin_create_id: authorize.admin_create_id,
                                    agent_create_id: authorize.agent_create_id,
                                    manager_create_id: authorize.id
                                };
                            }
                            yield Helpers.create(firebase_1.usersCollectionRef, user)
                                .then(() => __awaiter(this, void 0, void 0, function* () {
                                return res.sendStatus(200);
                            }))
                                .catch(error => {
                                return res.send({ statusCode: res.statusCode, message: error });
                            });
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
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
        this.deleteUserAgent = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("admin_create_id", "==", authorize.id), (0, firestore_1.where)((0, firestore_1.documentId)(), "==", data.id));
                            const isUserMe = yield Helpers.getContain(q);
                            if (!isUserMe)
                                return res.status(400).json({ message: "don't have user" });
                            const closedUser = { status: "CLOSED" };
                            yield Helpers.update(data.id, firebase_1.DBUsers, closedUser)
                                .then(() => __awaiter(this, void 0, void 0, function* () {
                                return res.sendStatus(200);
                            }))
                                .catch(() => {
                                return res.status(400).json({ message: "delete agent unsuccessfully" });
                            });
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
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
        this.deleteUserManager = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("agent_create_id", "==", authorize.id), (0, firestore_1.where)((0, firestore_1.documentId)(), "==", data.id));
                            const isUserMe = yield Helpers.getContain(q);
                            if (!isUserMe)
                                return res.sendStatus(403);
                            const closedUser = { status: "CLOSED" };
                            yield Helpers.update(data.id, firebase_1.DBUsers, closedUser)
                                .then(() => __awaiter(this, void 0, void 0, function* () {
                                return res.sendStatus(200);
                            }))
                                .catch(() => {
                                return res.status(400).json({ message: "delete manager unsuccessfully" });
                            });
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
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
        this.deleteUserMember = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            if (authorize.role === "ADMIN") {
                                const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)((0, firestore_1.documentId)(), "==", data.id));
                                const isUserMe = yield Helpers.getContain(q);
                                if (!isUserMe)
                                    return res.sendStatus(403);
                            }
                            else if (authorize.role === "AGENT") {
                                const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("agent_create_id", "==", authorize.id), (0, firestore_1.where)((0, firestore_1.documentId)(), "==", data.id));
                                const isUserMe = yield Helpers.getContain(q);
                                if (!isUserMe)
                                    return res.sendStatus(403);
                            }
                            else if (authorize.role === "MANAGER") {
                                const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("agent_create_id", "==", authorize.agent_create_id), (0, firestore_1.where)("manager_create_id", "==", authorize.id), (0, firestore_1.where)((0, firestore_1.documentId)(), "==", data.id));
                                const isUserMe = yield Helpers.getContain(q);
                                if (!isUserMe)
                                    return res.sendStatus(403);
                            }
                            const closedUser = { status: "CLOSED" };
                            yield Helpers.update(data.id, firebase_1.DBUsers, closedUser)
                                .then(() => __awaiter(this, void 0, void 0, function* () {
                                return res.sendStatus(200);
                            }))
                                .catch(() => {
                                return res.status(400).json({ message: "delete member unsuccessfully" });
                            });
                        }
                        else {
                            return res.sendStatus(authorize);
                        }
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
        this.login = (url) => {
            api_1.router.post(url, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = req.body;
                    const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("username", "==", data.username));
                    const [user] = yield Helpers.getContain(q);
                    if (!user)
                        return res.status(400).send({ message: "no account" });
                    const isPasswordValid = yield bcrypt_1.default.compare(data.password, user.password);
                    if (!isPasswordValid)
                        return res.status(400).send({ message: "invalid password" });
                    if (!user.tokenVersion)
                        return res.sendStatus(403);
                    const token = (0, authenticate_1.createToken)(user.id, user.tokenVersion, user.role);
                    const VITE_OPS_COOKIE_NAME = process.env.VITE_OPS_COOKIE_NAME;
                    return res.cookie(VITE_OPS_COOKIE_NAME, token, {
                        httpOnly: false,
                        secure: true,
                        sameSite: "lax"
                    })
                        .status(200)
                        .json({
                        id: user.id,
                        username: user.username,
                        credit: user.credit,
                        fullname: user.fullname,
                        role: user.role,
                        status: user.status,
                        admin_create_id: user.admin_create_id,
                        agent_create_id: user.agent_create_id,
                        manager_create_id: user.manager_create_id,
                        store_id: user.store_id,
                        created_at: user.created_at,
                        updated_at: user.updated_at,
                        user_create_id: user.user_create_id
                    });
                }
                catch (err) {
                    res.send(err);
                }
            }));
        };
        this.logout = (url, middleware, roles) => {
            api_1.router.post(url, middleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const authorize = yield (0, authorization_1.authorization)(req, roles);
                    if (authorize) {
                        if (authorize !== 401) {
                            const data = req.body;
                            if (data.username !== authorize.username)
                                return res.sendStatus(401);
                            const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("username", "==", data.username));
                            const users = yield Helpers.getContain(q);
                            if (users.length === 0)
                                return res.status(400).send({ message: "no account" });
                            users.map((user) => __awaiter(this, void 0, void 0, function* () {
                                const VITE_OPS_COOKIE_NAME = process.env.VITE_OPS_COOKIE_NAME;
                                const updateToken = { tokenVersion: user.tokenVersion + 1 };
                                Helpers.update(authorize.id, firebase_1.DBUsers, updateToken);
                                res.clearCookie(VITE_OPS_COOKIE_NAME, {
                                    httpOnly: false,
                                    secure: true,
                                    sameSite: "lax"
                                });
                                res.json({ message: "logout" });
                            }));
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
                    res.send(err);
                }
            }));
        };
        this.updateUser = (url, middleware, roles) => {
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
    }
}
exports.ApiUser = ApiUser;
