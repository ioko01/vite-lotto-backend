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

    Bill.getBillMe('/getbillme', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    Bill.getBillAll('/getbillall', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Bill.addBill('/addbill', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    Bill.updateBill('/updatebill', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Bill.deleteBill('/deletebill', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])

    Store.get('/getstore', authenticate)
    Store.add('/addstore', authenticate)

    User.get('/getuser', authenticate)
    User.register('/auth/register')
    User.login('/auth/login')

    APP.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
}

server()
