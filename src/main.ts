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
import { ApiLotto } from './api/lotto';
import { ApiRate } from './api/rate';

dotenv.config()

export const APP: Express = express()

const server = async () => {
    APP.use(cookieParser())
    APP.use(cors(corsOption))
    APP.use(bodyParser.json())

    const Bill = new ApiBill()
    const User = new ApiUser()
    const Store = new ApiStore()
    const Lotto = new ApiLotto()
    const Rate = new ApiRate()

    Bill.getBillId('/get/bill/id/:id', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    Bill.getBillMe('/get/bill/me', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    Bill.getBillAll('/get/bill/all', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Bill.addBill('/add/bill', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    Bill.updateBill('/update/bill', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Bill.deleteBill('/delete/bill', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])

    Lotto.getLottoId('/get/lotto/id/:id', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    Lotto.getLottoMe('/get/lotto/me', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    Lotto.getLottoAll('/get/lotto/all', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    Lotto.addLotto('/add/lotto', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Lotto.updateLotto('/update/lotto', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Lotto.deleteLotto('/delete/lotto', authenticate, ["ADMIN", "AGENT", "MANAGER"])

    Store.getStoreId('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Store.getStoreMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Store.getStoreAll('/get/store', authenticate, ["ADMIN"])
    Store.addStore('/add/store', authenticate, ["ADMIN"])
    Store.updateStore('/add/store', authenticate, ["ADMIN"])
    Store.deleteStore('/add/store', authenticate, ["ADMIN"])

    Rate.getRateId('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Rate.getRateMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Rate.getRateAll('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Rate.addRate('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Rate.updateRate('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    Rate.deleteRate('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])

    User.getUserAll('/get/user', authenticate, ["ADMIN"])
    User.getUserMe('/get/user', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    User.addUser('/add/user')
    User.login('/auth/login')
    User.logout('/auth/logout', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])

    APP.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
}

server()
