"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.router = exports.APP = void 0;
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
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const digitCloseHandler_1 = require("./socket/digitCloseHandler");
(0, dotenv_1.config)();
exports.APP = (0, express_1.default)();
exports.router = express_1.default.Router();
const server = http_1.default.createServer(exports.APP);
exports.io = new socket_io_1.Server(server, { cors: default_1.corsOption });
// APP.set("trust proxy", 1)
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
exports.io.on("connection", (socket) => {
    (0, digitCloseHandler_1.digitCloseHandler)(socket);
    socket.on("disconnect", () => {
        console.log("user is disconnected");
    });
});
// :id = ?????????????????????????????????????????? :store = ????????????????????????
Bill.getBillAllMe('/get/bill/id/:id', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // ???????????????????????????????????????????????????????????????????????????
Bill.getBillAll('/get/bill/all', authenticate_1.authenticate, ["ADMIN"]); // ????????????????????????????????????
Bill.getBillMe('/get/bill/me', authenticate_1.authenticate, ["MEMBER"]); // ?????????????????????????????????
Bill.addBill('/add/bill', authenticate_1.authenticate, ["MEMBER"]); // ????????????????????????
// Bill.updateBill('/update/bill', authenticate, ["MANAGER"])
Bill.deleteBill('/delete/bill', authenticate_1.authenticate, ["MANAGER", "MEMBER"]);
// Lotto.getLottoId('/get/lotto/id/:id', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
// Lotto.getLottoMe('/get/lotto/me', authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"])
Lotto.getLottoAll('/get/lotto/all', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]);
Lotto.getLottoId('/get/lotto/id/:id', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]);
Lotto.addLotto('/add/lotto', authenticate_1.authenticate, ["ADMIN"]);
Lotto.updateLotto('/update/lotto', authenticate_1.authenticate, ["ADMIN"]);
Lotto.deleteLotto('/delete/lotto', authenticate_1.authenticate, ["ADMIN"]);
Store.getStoreAllMe('/get/store/me/:id', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // agent ??????????????????????????????????????????????????????????????????????????????
Store.getStoreMe('/get/store/me', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MANAGE_REWARD", "MEMBER"]); // ?????????????????????????????????????????????
Store.getStoreAll('/get/store', authenticate_1.authenticate, ["ADMIN"]); //???????????????????????????????????????
Store.addStore('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT"]); //???????????????????????????
Store.updateStore('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT"]); //??????????????????????????????
Store.deleteStore('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT"]); //?????????????????? (????????????????????????????????????????????????????????????)
Rate.getRateAllMe('/get/rate/me/all', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // ???????????????????????????????????????????????????????????????????????????????????????
Rate.getRateMe('/get/rate/me', authenticate_1.authenticate, ["MANAGER", "MEMBER"]); // ??????????????????????????????????????????????????????????????????
Rate.getRateAll('/get/rate', authenticate_1.authenticate, ["ADMIN"]); // ????????????????????????????????????????????????
Rate.getRateId('/get/rate/id/:id', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MANAGE_REWARD", "MEMBER"]); // ????????????????????????????????????????????????
Rate.addRate('/add/rate', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // ????????????????????????????????????
Rate.updateRate('/add/rate', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
Rate.deleteRate('/add/rate', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitSemi.getDigitSemiId('/get/digitsemi', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // ??????????????????????????????????????????????????????????????????????????????????????????????????????
DigitSemi.getDigitSemiMe('/get/digitsemi', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]); // ?????????????????????????????????????????????????????????????????????????????????
DigitSemi.getDigitSemiAll('/get/digitsemi', authenticate_1.authenticate, ["ADMIN"]); // ????????????????????????????????????????????????????????????????????????
DigitSemi.addDigitSemi('/add/digitsemi', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitSemi.updateDigitSemi('/add/digitsemi', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitSemi.deleteDigitSemi('/add/digitsemi', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitClose.getDigitCloseId('/get/digitclose/id/:id', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]);
DigitClose.getDigitCloseMe('/get/digitclose/me', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]);
DigitClose.getDigitCloseAll('/get/digitclose/all', authenticate_1.authenticate, ["ADMIN"]);
DigitClose.addDigitClose('/add/digitclose', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitClose.updateDigitClose('/update/digitclose', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
DigitClose.deleteDigitClose('/delete/digitclose', authenticate_1.authenticate, ["ADMIN", "AGENT"]);
// CheckReward.getCheckRewardId('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
// CheckReward.getCheckRewardMe('/get/store', authenticate, ["ADMIN", "AGENT", "MANAGER"])
CheckReward.getCheckRewardAll('/get/store', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER", "MANAGE_REWARD"]);
CheckReward.addCheckReward('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGE_REWARD"]);
CheckReward.updateCheckReward('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGE_REWARD"]);
CheckReward.deleteCheckReward('/add/store', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGE_REWARD"]);
User.getUserAll('/get/user/all', authenticate_1.authenticate, ["ADMIN"]); // ??????????????????????????????????????????????????????
User.getUserAllMe('/get/user/me', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // ????????????????????????????????????????????????????????????????????????
User.getMe('/me', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER", "MANAGE_REWARD"]); // ??????????????????????????????????????????
User.credit('/:excute/credit', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // ?????????????????? (???????????????/??????)
User.statusAgent('/update/status/agent', authenticate_1.authenticate, ["ADMIN"]); // ?????????????????? (???????????????/??????)
User.statusManager('/status/manager/:store', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // ?????????????????? (???????????????/??????)
User.statusMember('/status/member/:store', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // ?????????????????? (???????????????/??????)
User.addUserAdmin('/add/admin'); // ??????????????? admin
User.addUserAgent('/add/agent', authenticate_1.authenticate, ["ADMIN"]); // ??????????????? agent
User.addUserManager('/add/manager', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // ??????????????? manager
User.addUserMember('/add/member', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // ??????????????? member
User.deleteUserAgent('/delete/agent', authenticate_1.authenticate, ["ADMIN"]); // ?????? agent
User.deleteUserManager('/delete/manager', authenticate_1.authenticate, ["ADMIN", "AGENT"]); // ??????????????? manager
User.deleteUserMember('/delete/member', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER"]); // ??????????????? member
User.login('/auth/login'); // login
User.logout('/auth/logout', authenticate_1.authenticate, ["ADMIN", "AGENT", "MANAGER", "MEMBER"]); // logout
// ?????????????????????????????? ?????????????????? (???????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????)
// ??????????????? admin
// admin ???????????????????????? ???????????????????????? ???????????????????????????????????????
// admin ??????????????? agent
// agent ??????????????? ????????????
// agent ?????????????????????????????????????????????????????????????????????????????? & ???????????????????????????????????????
// agent ??????????????? manager ????????????????????????????????? manager ???????????????????????????????????????????????????
// agent ??????????????? credit ????????? manager
// manager ??????????????? member
// manager ??????????????? credit ????????? member
// member ????????????????????????
// ??????????????????????????????????????? MANAGE_REWARD ????????????????????????????????????
exports.router.get("/", (_, res) => {
    res.send("Welcome to API");
});
exports.APP.use("/", exports.router);
server.listen(default_1.PORT, () => {
    console.log(`??????[server]: Server is running at http://localhost:${default_1.PORT}`);
});
// export const handler = serverless(APP);
