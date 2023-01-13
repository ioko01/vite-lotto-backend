"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
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
