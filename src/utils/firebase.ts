import { FirebaseOptions, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import dotenv from 'dotenv'

dotenv.config()

const FIREBASE_CONFIG: FirebaseOptions = {
    apiKey: process.env.VITE_OPS_FIREBASE_API_KEY,
    authDomain: process.env.VITE_OPS_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.VITE_OPS_FIREBASE_DATABASE_URL,
    projectId: process.env.VITE_OPS_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_OPS_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_OPS_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_OPS_FIREBASE_APP_ID,
    measurementId: process.env.VITE_OPS_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(FIREBASE_CONFIG)
export const db = getFirestore(app)

