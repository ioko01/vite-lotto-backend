import express, { Express, Request, Response } from 'express'
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import dotenv from 'dotenv'
import { ApiBill } from './api/bill';
import { ApiUser } from './api/user';

dotenv.config()

export const APP: Express = express()
const PORT: string | number = process.env.PORT || 8000

const corsOption: CorsOptions = {
    origin: "http://127.0.0.1:5173",
}

APP.use(cors(corsOption))
APP.use(bodyParser.json())

new ApiBill().get('/getbill')
new ApiBill().add('/addbill')
new ApiBill().update('/updatebill')

new ApiUser().get('/getuser')
new ApiUser().add('/adduser')

APP.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})