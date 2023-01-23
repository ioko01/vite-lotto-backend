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

    // :id = ไอดีที่ต้องการ :store = ไอดีร้าน
    Bill.getBillId('/get/bill/id/:id/:store', authenticate, ["ADMIN", "AGENT", "MANAGER"])// ดูบิลทั้งหมดของร้านตัวเอง
    Bill.getBillMe('/get/bill/me', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])// ดูบิลของฉัน
    Bill.getBillAll('/get/bill/all', authenticate, ["ADMIN"])// ดูบิลทั้งหมด
    Bill.addBill('/add/bill', authenticate, ["MEMBER"])
    // Bill.updateBill('/update/bill', authenticate, ["MANAGER"])
    Bill.deleteBill('/delete/bill', authenticate, ["MANAGER", "MEMBER"])

    // Lotto.getLottoId('/get/lotto/id/:id', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    // Lotto.getLottoMe('/get/lotto/me', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    Lotto.getLottoAll('/get/lotto/all', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    Lotto.addLotto('/add/lotto', authenticate, ["ADMIN"])
    Lotto.updateLotto('/update/lotto', authenticate, ["ADMIN"])
    Lotto.deleteLotto('/delete/lotto', authenticate, ["ADMIN"])

    Store.getStoreId('/get/store/:id/:store', authenticate, ["ADMIN", "AGENT"])// agent ดูร้านในเครือข่ายของตัวเอง
    Store.getStoreMe('/get/store/me', authenticate, ["ADMIN", "AGENT", "MANAGER"])// ดูร้านของตัวเอง
    Store.getStoreAll('/get/store', authenticate, ["ADMIN"])//ดูร้านทุกร้าน
    Store.addStore('/add/store', authenticate, ["ADMIN", "AGENT"])//เพิ่มร้าน
    Store.updateStore('/add/store', authenticate, ["ADMIN", "AGENT"])//อัพเดตร้าน
    Store.deleteStore('/add/store', authenticate, ["ADMIN", "AGENT"])//ลบร้าน (ทำเป็นสถานะลบออกเฉยๆ)

    Rate.getRateId('/get/store/:id/:rate', authenticate, ["ADMIN", "AGENT"])// ดูเรทราคาในเครือข่ายของตัวเอง
    Rate.getRateMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])// ดูเรทราคาของร้านตัวเอง
    Rate.getRateAll('/get/store', authenticate, ["ADMIN"])// ดูเรทราคาทุกร้าน
    Rate.addRate('/add/store', authenticate, ["ADMIN", "AGENT"])// เพิ่มเรทราคา
    Rate.updateRate('/add/store', authenticate, ["ADMIN", "AGENT"])
    Rate.deleteRate('/add/store', authenticate, ["ADMIN", "AGENT"])

    DigitSemi.getDigitSemiId('/get/store', authenticate, ["ADMIN", "AGENT"])// ดูเลขจ่ายครึ่งในเครือข่ายของตัวเอง
    DigitSemi.getDigitSemiMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])// ดูเลขจ่ายครึ่งของร้านตัวเอง
    DigitSemi.getDigitSemiAll('/get/store', authenticate, ["ADMIN"])// ดูเลขจ่ายครึ่งของทุกร้าน
    DigitSemi.addDigitSemi('/add/store', authenticate, ["ADMIN", "AGENT"])
    DigitSemi.updateDigitSemi('/add/store', authenticate, ["ADMIN", "AGENT"])
    DigitSemi.deleteDigitSemi('/add/store', authenticate, ["ADMIN", "AGENT"])

    DigitClose.getDigitCloseId('/get/store', authenticate, ["ADMIN", "AGENT"])
    DigitClose.getDigitCloseMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
    DigitClose.getDigitCloseAll('/get/store', authenticate, ["ADMIN"])
    DigitClose.addDigitClose('/add/store', authenticate, ["ADMIN", "AGENT"])
    DigitClose.updateDigitClose('/add/store', authenticate, ["ADMIN", "AGENT"])
    DigitClose.deleteDigitClose('/add/store', authenticate, ["ADMIN", "AGENT"])

    // CheckReward.getCheckRewardId('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    // CheckReward.getCheckRewardMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
    CheckReward.getCheckRewardAll('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER", "MANAGE_REWARD"])
    CheckReward.addCheckReward('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGE_REWARD"])
    CheckReward.updateCheckReward('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGE_REWARD"])
    CheckReward.deleteCheckReward('/add/store', authenticate, ["ADMIN", "AGENT", "MANAGE_REWARD"])

    User.getUserAll('/get/user/all', authenticate, ["ADMIN"])// ดูผู้ใช้งานทั้งหมด
    User.getUserMe('/get/user/me', authenticate, ["ADMIN", "AGENT", "MANAGER"])// ดูผู้ใช้งานลูกข่ายตัวเอง
    User.getMe('/me', authenticate, ["ADMIN", "AGENT", "MANAGER"])// ดูข้อมูลตัวเอง
    User.credit('/:excute/credit', authenticate, ["ADMIN", "AGENT", "MANAGER"])// เครดิต (เพิ่ม/ลบ)
    User.statusAgent('/status/agent', authenticate, ["ADMIN"])// เครดิต (เพิ่ม/ลบ)
    User.statusManager('/status/manager/:store', authenticate, ["ADMIN", "AGENT"])// เครดิต (เพิ่ม/ลบ)
    User.statusMember('/status/member/:store', authenticate, ["ADMIN", "AGENT", "MANAGER"])// เครดิต (เพิ่ม/ลบ)
    User.addUserAdmin('/add/admin')// เพิ่ม admin
    User.addUserAgent('/add/agent', authenticate, ["ADMIN"])// เพิ่ม agent
    User.addUserManager('/add/manager', authenticate, ["ADMIN", "AGENT"])// เพิ่ม manager
    User.addUserMember('/add/member', authenticate, ["ADMIN", "AGENT", "MANAGER"])// เพิ่ม member
    User.login('/auth/login')// login
    User.logout('/auth/logout', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])// logout

    // เหลือสร้าง ประกาศ (เช่น ประกาศว่าหวยนี้เลื่อนไปเปิดเวลาไหน)


    // สร้าง admin
    // admin สร้างหวย เวลาเปิด เวลาปิดรับหวย
    // admin เพิ่ม agent
    // agent เพิ่ม ร้าน
    // agent กำหนดเรทการจ่ายของแต่ละหวย & ค่าคอมมิชชั่น
    // agent เพิ่ม manager และเลือกว่า manager คนนี้จะคุมร้านไหน
    // agent เพิ่ม credit ให้ manager
    // manager เพิ่ม member
    // manager เพิ่ม credit ให้ member
    // member เพิ่มบิล
    // รอผลออกและให้ MANAGE_REWARD เป็นคนกรอกผล

    APP.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
}

server()
