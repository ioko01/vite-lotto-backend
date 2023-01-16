import express, { Express, NextFunction, Request, Response } from 'express'
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import dotenv from 'dotenv'
import { ApiBill } from './api/bill';
import { ApiUser } from './api/user';
import { createToken, sendToken, verifyToken } from "./helpers/Token";
import { collection, getDocs } from 'firebase/firestore';
import { IUser } from './models/User';
import { db } from './utils/firebase';
import { ApiStore } from './api/store';
import { PORT, corsOption } from './config/default';

dotenv.config()

export const APP: Express = express()


APP.use(cors(corsOption))
APP.use(bodyParser.json())

const Bill = new ApiBill()
const User = new ApiUser()
const Store = new ApiStore()

async function middleware(req: Request, res: Response, next: NextFunction) {
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

Bill.get('/getbill', middleware)
Bill.add('/addbill', middleware)
Bill.update('/updatebill', middleware)

Store.get('/getstore', middleware)
Store.add('/addstore', middleware)

User.get('/getuser')
User.register('/register')
User.login('/login')
User.addAdmin('/addadmin')

APP.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})