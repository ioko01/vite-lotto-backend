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
exports.UserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase/firestore");
const time_1 = require("../utils/time");
class UserController {
    constructor() {
        this.getContain = (q) => __awaiter(this, void 0, void 0, function* () {
            const { docs } = yield (0, firestore_1.getDocs)(q);
            return docs.map((doc) => {
                return Object.assign(Object.assign({}, doc.data()), { id: doc.id });
            });
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            const { docs } = yield (0, firestore_1.getDocs)(firebase_1.usersCollectionRef);
            return docs.map((doc) => {
                return Object.assign(Object.assign({}, doc.data()), { id: doc.id });
            });
        });
        this.create = (user) => __awaiter(this, void 0, void 0, function* () {
            return yield (0, firestore_1.addDoc)(firebase_1.usersCollectionRef, user);
        });
        this.createAdmin = (user) => __awaiter(this, void 0, void 0, function* () {
            const q = (0, firestore_1.query)(firebase_1.usersCollectionRef, (0, firestore_1.where)("role", "==", User_1.TUserRoleEnum.ADMIN));
            const { docs } = yield (0, firestore_1.getDocs)(q);
            if (docs.length === 0) {
                const { credit, fullname, password, role, status, username } = user;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const userObj = {
                    username,
                    password: hashedPassword,
                    fullname,
                    role,
                    status,
                    credit,
                    created_at: (0, time_1.GMT)(),
                    updated_at: (0, time_1.GMT)()
                };
                yield (0, firestore_1.addDoc)(firebase_1.usersCollectionRef, userObj)
                    .then(() => {
                    return true;
                })
                    .catch(() => {
                    return false;
                });
            }
            else {
                return false;
            }
        });
        this.addAdmin = (user) => __awaiter(this, void 0, void 0, function* () {
        });
        this.update = (id, user) => __awaiter(this, void 0, void 0, function* () {
            const tutorialDoc = (0, firestore_1.doc)(firebase_1.db, firebase_1.DBUsers, id);
            return yield (0, firestore_1.updateDoc)(tutorialDoc, firebase_1.DBUsers, user);
        });
    }
}
exports.UserController = UserController;
