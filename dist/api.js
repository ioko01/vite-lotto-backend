"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.APP = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const bill_1 = require("./routes/bill");
const user_1 = require("./routes/user");
const store_1 = require("./routes/store");
const default_1 = require("./config/default");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authenticate_1 = require("./middleware/authenticate");
const lotto_1 = require("./routes/lotto");
const rate_1 = require("./routes/rate");
const digitSemi_1 = require("./routes/digitSemi");
const digitClose_1 = require("./routes/digitClose");
const checkReward_1 = require("./routes/checkReward");
(0, dotenv_1.config)();
exports.APP = (0, express_1.default)();
exports.router = express_1.default.Router();
exports.APP.use((0, cookie_parser_1.default)());
exports.APP.use((0, cors_1.default)(default_1.corsOption));
exports.APP.use(body_parser_1.default.json());
const Bill = new bill_1.ApiBill();
const User = new user_1.ApiUser();
const Store = new store_1.ApiStore();
const Lotto = new lotto_1.ApiLotto();
const Rate = new rate_1.ApiRate();
const DigitSemi = new digitSemi_1.ApiDigitSemi();
const DigitClose = new digitClose_1.ApiDigitClose();
const CheckReward = new checkReward_1.ApiCheckReward();
// :id = ไอดีที่ต้องการ :store = ไอดีร้าน
Bill.getBillAllMe('/get/bill/id/:id', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // ดูบิลทั้งหมดของร้านตัวเอง
Bill.getBillAll('/get/bill/all', authenticate_1.authenticate, ["ADMIN"]); // ดูบิลทั้งหมด
Bill.getBillMe('/get/bill/me', authenticate_1.authenticate, ["MEMBER"]); // ดูบิลของฉัน
Bill.addBill('/add/bill', authenticate_1.authenticate, ["MEMBER"]); // เพิ่มบิล
// Bill.updateBill('/update/bill', authenticate, ["MANAGER"])
Bill.deleteBill('/delete/bill', authenticate_1.authenticate, ["MANAGER", "MEMBER"]);
// Lotto.getLottoId('/get/lotto/id/:id', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
// Lotto.getLottoMe('/get/lotto/me', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
Lotto.getLottoAll('/get/lotto/all', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]);
Lotto.getLottoId('/get/lotto/id/:id', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]);
Lotto.addLotto('/add/lotto', authenticate_1.authenticate, ["ADMIN"]);
Lotto.updateLotto('/update/lotto', authenticate_1.authenticate, ["ADMIN"]);
Lotto.deleteLotto('/delete/lotto', authenticate_1.authenticate, ["ADMIN"]);
Store.getStoreAllMe('/get/store/me/:id', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // agent ดูร้านในเครือข่ายของตัวเอง
Store.getStoreMe('/get/store/me', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MANAGE_REWARD", "MEMBER"]); // ดูร้านของตัวเอง
Store.getStoreAll('/get/store', authenticate_1.authenticate, ["ADMIN"]); //ดูร้านทุกร้าน
Store.addStore('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT"]); //เพิ่มร้าน
Store.updateStore('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT"]); //อัพเดตร้าน
Store.deleteStore('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT"]); //ลบร้าน (ทำเป็นสถานะลบออกเฉยๆ)
Rate.getRateAllMe('/get/rate/me/all', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // ดูเรทราคาในเครือข่ายของตัวเอง
Rate.getRateMe('/get/rate/me', authenticate_1.authenticate, ["MANAGER", "MEMBER"]); // ดูเรทราคาของร้านตัวเอง
Rate.getRateAll('/get/rate', authenticate_1.authenticate, ["ADMIN"]); // ดูเรทราคาทุกร้าน
Rate.addRate('/add/rate', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // เพิ่มเรทราคา
Rate.updateRate('/add/rate', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
Rate.deleteRate('/add/rate', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitSemi.getDigitSemiId('/get/digitsemi', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // ดูเลขจ่ายครึ่งในเครือข่ายของตัวเอง
DigitSemi.getDigitSemiMe('/get/digitsemi', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]); // ดูเลขจ่ายครึ่งของร้านตัวเอง
DigitSemi.getDigitSemiAll('/get/digitsemi', authenticate_1.authenticate, ["ADMIN"]); // ดูเลขจ่ายครึ่งของทุกร้าน
DigitSemi.addDigitSemi('/add/digitsemi', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitSemi.updateDigitSemi('/add/digitsemi', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitSemi.deleteDigitSemi('/add/digitsemi', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitClose.getDigitCloseId('/get/digitclose', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitClose.getDigitCloseMe('/get/digitclose', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]);
DigitClose.getDigitCloseAll('/get/digitclose', authenticate_1.authenticate, ["ADMIN"]);
DigitClose.addDigitClose('/add/digitclose', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitClose.updateDigitClose('/add/digitclose', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitClose.deleteDigitClose('/add/digitclose', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
// CheckReward.getCheckRewardId('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
// CheckReward.getCheckRewardMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
CheckReward.getCheckRewardAll('/get/store', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER", "MANAGE_REWARD"]);
CheckReward.addCheckReward('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGE_REWARD"]);
CheckReward.updateCheckReward('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGE_REWARD"]);
CheckReward.deleteCheckReward('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGE_REWARD"]);
User.getUserAll('/get/user/all', authenticate_1.authenticate, ["ADMIN"]); // ดูผู้ใช้งานทั้งหมด
User.getUserAllMe('/get/user/me', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // ดูผู้ใช้งานลูกข่ายตัวเอง
User.getMe('/me', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER", "MANAGE_REWARD"]); // ดูข้อมูลตัวเอง
User.credit('/:excute/credit', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // เครดิต (เพิ่ม/ลบ)
User.statusAgent('/update/status/agent', authenticate_1.authenticate, ["ADMIN"]); // เครดิต (เพิ่ม/ลบ)
User.statusManager('/status/manager/:store', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // เครดิต (เพิ่ม/ลบ)
User.statusMember('/status/member/:store', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // เครดิต (เพิ่ม/ลบ)
User.addUserAdmin('/add/admin'); // เพิ่ม admin
User.addUserAgent('/add/agent', authenticate_1.authenticate, ["ADMIN"]); // เพิ่ม agent
User.addUserManager('/add/manager', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // เพิ่ม manager
User.addUserMember('/add/member', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // เพิ่ม member
User.deleteUserAgent('/delete/agent', authenticate_1.authenticate, ["ADMIN"]); // ลบ agent
User.deleteUserManager('/delete/manager', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // เพิ่ม manager
User.deleteUserMember('/delete/member', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // เพิ่ม member
User.login('/auth/login'); // login
User.logout('/auth/logout', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]); // logout
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
exports.APP.use("/", exports.router);
exports.APP.listen(default_1.PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${default_1.PORT}`);
});
// export const handler = serverless(APP);
