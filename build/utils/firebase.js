"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.committionsCollectionRef = exports.DBCommittions = exports.checkRewardsCollectionRef = exports.DBCheckRewards = exports.digitsCloseCollectionRef = exports.DBDigitsClose = exports.digitsSemiCollectionRef = exports.DBDigitsSemi = exports.ratesCollectionRef = exports.DBRates = exports.lottosCollectionRef = exports.DBLottos = exports.storesCollectionRef = exports.DBStores = exports.billsCollectionRef = exports.DBBills = exports.usersCollectionRef = exports.DBUsers = exports.db = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const FIREBASE_CONFIG = {
    apiKey: process.env.VITE_OPS_FIREBASE_API_KEY,
    authDomain: process.env.VITE_OPS_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VITE_OPS_FIREBASE_DATABASE_URL,
    projectId: process.env.VITE_OPS_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_OPS_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_OPS_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_OPS_FIREBASE_APP_ID,
    measurementId: process.env.VITE_OPS_FIREBASE_MEASUREMENT_ID
};
const app = (0, app_1.initializeApp)(FIREBASE_CONFIG);
exports.db = (0, firestore_1.getFirestore)(app);
exports.DBUsers = "users";
exports.usersCollectionRef = (0, firestore_1.collection)(exports.db, exports.DBUsers);
exports.DBBills = "bills";
exports.billsCollectionRef = (0, firestore_1.collection)(exports.db, exports.DBBills);
exports.DBStores = "stores";
exports.storesCollectionRef = (0, firestore_1.collection)(exports.db, exports.DBStores);
exports.DBLottos = "lottos";
exports.lottosCollectionRef = (0, firestore_1.collection)(exports.db, exports.DBLottos);
exports.DBRates = "rates";
exports.ratesCollectionRef = (0, firestore_1.collection)(exports.db, exports.DBRates);
exports.DBDigitsSemi = "digits_semi";
exports.digitsSemiCollectionRef = (0, firestore_1.collection)(exports.db, exports.DBDigitsSemi);
exports.DBDigitsClose = "digits_close";
exports.digitsCloseCollectionRef = (0, firestore_1.collection)(exports.db, exports.DBDigitsClose);
exports.DBCheckRewards = "check_rewards";
exports.checkRewardsCollectionRef = (0, firestore_1.collection)(exports.db, exports.DBCheckRewards);
exports.DBCommittions = "committions";
exports.committionsCollectionRef = (0, firestore_1.collection)(exports.db, exports.DBCommittions);
