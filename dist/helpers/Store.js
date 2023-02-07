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
exports.StoreController = void 0;
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase/firestore");
class StoreController {
    constructor() {
        this.getContain = () => __awaiter(this, void 0, void 0, function* () {
            const { docs } = yield (0, firestore_1.getDocs)(firebase_1.storesCollectionRef);
            return docs.map((doc) => {
                return Object.assign(Object.assign({}, doc.data()), { id: doc.id });
            });
        });
        this.getMe = () => __awaiter(this, void 0, void 0, function* () {
            const { docs } = yield (0, firestore_1.getDocs)(firebase_1.storesCollectionRef);
            return docs.map((doc) => {
                return Object.assign(Object.assign({}, doc.data()), { id: doc.id });
            });
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            const { docs } = yield (0, firestore_1.getDocs)(firebase_1.storesCollectionRef);
            return docs.map((doc) => {
                return Object.assign(Object.assign({}, doc.data()), { id: doc.id });
            });
        });
        this.add = (store) => __awaiter(this, void 0, void 0, function* () {
            return yield (0, firestore_1.addDoc)(firebase_1.storesCollectionRef, store);
        });
        this.update = (id, store) => __awaiter(this, void 0, void 0, function* () {
            const tutorialDoc = (0, firestore_1.doc)(firebase_1.db, firebase_1.DBStores, id);
            return yield (0, firestore_1.updateDoc)(tutorialDoc, firebase_1.DBStores, store);
        });
    }
}
exports.StoreController = StoreController;
