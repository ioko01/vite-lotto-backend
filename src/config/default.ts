import { CorsOptions } from "cors";
import dotenv from "dotenv";
dotenv.config()

export const PORT: string | number = process.env.PORT || 8000
export const corsOption: CorsOptions = {
    origin: "http://127.0.0.1:5173",
}

export default {
    port: PORT,
    accessTokenExpiresIn: 15,
    origin: process.env.VITE_OPS_URL
}