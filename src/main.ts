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
import { ApiDigitSemi } from './api/digitSemi';
import { ApiDigitClose } from './api/digitClose';
import { ApiCheckReward } from './api/checkReward';

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
    const DigitSemi = new ApiDigitSemi()
    const DigitClose = new ApiDigitClose()
    const CheckReward = new ApiCheckReward()

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

    DigitSemi.getDigitSemiId('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    DigitSemi.getDigitSemiMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    DigitSemi.getDigitSemiAll('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    DigitSemi.addDigitSemi('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    DigitSemi.updateDigitSemi('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    DigitSemi.deleteDigitSemi('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])

    DigitClose.getDigitCloseId('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    DigitClose.getDigitCloseMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    DigitClose.getDigitCloseAll('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    DigitClose.addDigitClose('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    DigitClose.updateDigitClose('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    DigitClose.deleteDigitClose('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])

    CheckReward.getCheckRewardId('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    CheckReward.getCheckRewardMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    CheckReward.getCheckRewardAll('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    CheckReward.addCheckReward('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    CheckReward.updateCheckReward('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    CheckReward.deleteCheckReward('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])

    User.getUserAll('/get/user/all', authenticate, ["ADMIN"])
    User.getUserMe('/get/user/me', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    User.addCredit('/add/credit', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    User.addUserAdmin('/add/admin')
    User.addUserAgent('/add/agent', authenticate, ["ADMIN"])
    User.addUserManager('/add/manager', authenticate, ["ADMIN", "AGENT"])
    User.addUserMember('/add/member', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    User.login('/auth/login')
    User.logout('/auth/logout', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])

    APP.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
}

server()
