import { CorsOptions } from "cors";
import dotenv from "dotenv";
dotenv.config()

export const PORT: string | number = process.env.PORT || 8000
export const corsOption: CorsOptions = {
    origin: process.env.VITE_OPS_URL,
}
export const accessTokenExpiresIn = 15
export const origin = process.env.VITE_OPS_URL
