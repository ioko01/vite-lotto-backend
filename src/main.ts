import express, { Express, NextFunction, Request, Response } from 'express'
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import dotenv from 'dotenv'
import { ApiBill } from './api/bill';
import { ApiUser } from './api/user';
// import { createToken, sendToken, verifyToken } from "./helpers/Token";
import { collection, getDocs } from 'firebase/firestore';
import { IUser } from './models/User';
import { db } from './utils/firebase';
import { ApiStore } from './api/store';
import { PORT, corsOption } from './config/default';
import cookieParser from 'cookie-parser';
import { auth } from './middleware/auth';

dotenv.config()

export const APP: Express = express()

const server = async () => {
    // APP.use(cookieParser())
    APP.use(cors(corsOption))
    APP.use(bodyParser.json())

    const Bill = new ApiBill()
    const User = new ApiUser()
    const Store = new ApiStore()

    async function md(req: Request, res: Response, next: NextFunction) {
        try {
            next()
            // const Bills = "users"
            // const billCollectionRef = collection(db, Bills)
            // const { docs } = await getDocs(billCollectionRef)

            // if (docs.length > 0) {
            //     next()
            // } else {
            //     throw {
            //         statusCode: 401,
            //         error: new Error()
            //     }
            // }
        } catch (error) {
            throw error
        }

    }

    Bill.get('/getbill', auth)
    Bill.add('/addbill', auth)
    Bill.update('/updatebill', auth)

    Store.get('/getstore', md)
    Store.add('/addstore', md)

    User.get('/getuser')
    User.register('/auth/register')
    User.login('/auth/login')
    User.createAdmin('/auth/admin')

    APP.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
}

server()
