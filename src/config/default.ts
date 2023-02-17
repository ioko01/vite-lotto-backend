import { CorsOptions } from "cors";
import { config } from "dotenv";
config()

export const PORT: string | number = process.env.PORT || 8000
export const corsOption: CorsOptions = {
    origin: process.env.VITE_OPS_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}
