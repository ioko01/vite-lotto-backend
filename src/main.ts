import express, { Express } from 'express'
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv'
import { ApiBill } from './api/bill';
import { ApiUser } from './api/user';
import { ApiStore } from './api/store';
import { PORT, corsOption } from './config/default';
import cookieParser from 'cookie-parser';
import { authenticate } from './middleware/authenticate';
import { TUserRoleEnum } from './models/User';

dotenv.config()

export const APP: Express = express()

const server = async () => {
    APP.use(cookieParser())
    APP.use(cors(corsOption))
    APP.use(bodyParser.json())

    const Bill = new ApiBill()
    const User = new ApiUser()
    const Store = new ApiStore()

    Bill.get('/getbill', authenticate, ["ADMIN", "AGENT"])
    Bill.add('/addbill', authenticate)
    Bill.update('/updatebill', authenticate)

    Store.get('/getstore', authenticate)
    Store.add('/addstore', authenticate)

    User.get('/getuser')
    User.register('/auth/register')
    User.login('/auth/login')
    User.createAdmin('/auth/admin')

    APP.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
}

server()
