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
exports.HelperController = void 0;
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase/firestore");
const bcrypt_1 = require("bcrypt");
const time_1 = require("../utils/time");
class HelperController {
    constructor() {
        this.getId = (doc) => __awaiter(this, void 0, void 0, function* () {
            const id = yield (0, firestore_1.getDoc)(doc);
            return id.data();
        });
        this.getContain = (q) => __awaiter(this, void 0, void 0, function* () {
            const { docs } = yield (0, firestore_1.getDocs)(q);
            return docs.map((doc) => {
                return Object.assign(Object.assign({}, doc.data()), { id: doc.id });
            });
        });
        this.getAll = (reference) => __awaiter(this, void 0, void 0, function* () {
            const { docs } = yield (0, firestore_1.getDocs)(reference);
            return docs.map((doc) => {
                return Object.assign(Object.assign({}, doc.data()), { id: doc.id });
            });
        });
        this.add = (reference, data) => __awaiter(this, void 0, void 0, function* () {
            return yield (0, firestore_1.addDoc)(reference, data);
        });
        this.update = (id, dbname, data) => __awaiter(this, void 0, void 0, function* () {
            const isDoc = (0, firestore_1.doc)(firebase_1.db, dbname, id);
            return yield (0, firestore_1.updateDoc)(isDoc, data);
        });
        this.delete = (id, dbname) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getId((0, firestore_1.doc)(firebase_1.db, dbname, id));
            if (!data)
                return 400;
            const isDoc = (0, firestore_1.doc)(firebase_1.db, dbname, id);
            return yield (0, firestore_1.deleteDoc)(isDoc);
        });
        this.create = (reference, data) => __awaiter(this, void 0, void 0, function* () {
            return yield (0, firestore_1.addDoc)(reference, data);
        });
        this.createAdmin = (reference, q, data) => __awaiter(this, void 0, void 0, function* () {
            const { docs } = yield (0, firestore_1.getDocs)(q);
            if (docs.length === 0) {
                const { credit, fullname, password, role, status, username } = data;
                const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
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
                yield (0, firestore_1.addDoc)(reference, userObj)
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
    }
}
exports.HelperController = HelperController;
