"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const Default_1 = require("../helpers/Default");
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../utils/firebase");
function authorization(req, roles) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const VITE_OPS_COOKIE_NAME = process.env.VITE_OPS_COOKIE_NAME;
            const auth = req.cookies[VITE_OPS_COOKIE_NAME];
            if (auth) {
                const token = auth;
                const decodedToken = (0, jwt_decode_1.default)(token);
                const Helpers = new Default_1.HelperController();
                const user = yield Helpers.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBUsers, decodedToken.UID));
                if (decodedToken.tokenVersion === user.tokenVersion) {
                    const isUser = {
                        credit: user.credit,
                        fullname: user.fullname,
                        id: decodedToken.UID,
                        role: user.role,
                        status: user.status,
                        username: user.username,
                        admin_create_id: user.admin_create_id,
                        agent_create_id: user.agent_create_id,
                        manager_create_id: user.manager_create_id,
                        created_at: user.created_at,
                        updated_at: user.updated_at,
                        store_id: user.store_id,
                        user_create_id: user.user_create_id,
                        tokenVersion: user.tokenVersion,
                        password: user.password,
                    };
                    if (roles.includes(decodedToken.role))
                        return isUser;
                    return 401;
                }
                return 401;
            }
            return 401;
        }
        catch (error) {
            return 401;
        }
    });
}
exports.authorization = authorization;
