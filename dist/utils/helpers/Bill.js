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
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase/firestore");
const billDatebaseName = "bills";
const billCollectionRef = (0, firestore_1.collection)(firebase_1.db, billDatebaseName);
class BillController {
    constructor() {
        this.getBill = () => __awaiter(this, void 0, void 0, function* () {
            const { docs } = yield (0, firestore_1.getDocs)(billCollectionRef);
            return docs.map((doc) => {
                return Object.assign(Object.assign({}, doc.data()), { id: doc.id });
            });
        });
        this.addBill = (bill) => __awaiter(this, void 0, void 0, function* () {
            return (0, firestore_1.addDoc)(billCollectionRef, bill);
        });
        this.updateBill = (id, bill) => __awaiter(this, void 0, void 0, function* () {
            const tutorialDoc = (0, firestore_1.doc)(firebase_1.db, billDatebaseName, id);
            return (0, firestore_1.updateDoc)(tutorialDoc, billDatebaseName, bill);
        });
    }
}
exports.default = new BillController();
