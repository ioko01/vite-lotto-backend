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
exports.createToken = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../utils/keys");
const Default_1 = require("../helpers/Default");
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../utils/firebase");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function authenticate(req, res, next) {
    try {
        const VITE_OPS_COOKIE_NAME = process.env.VITE_OPS_COOKIE_NAME;
        const auth = req.cookies[VITE_OPS_COOKIE_NAME];
        if (auth) {
            const token = auth;
            jsonwebtoken_1.default.verify(token, keys_1.publicKey, {
                algorithms: ["RS256"],
            }, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return res.sendStatus(401);
                const decode = decoded;
                if (decode) {
                    const decodedToken = (0, jwt_decode_1.default)(token);
                    decodedToken.UID = decode.UID;
                    decodedToken.tokenVersion = decode.tokenVersion;
                    //Check 5 min to create token
                    if (Date.now() / 1000 - decode.iat > 60 * 5 * 1) {
                        const User = new Default_1.HelperController();
                        const user = yield User.getId((0, firestore_1.doc)(firebase_1.db, firebase_1.DBUsers, decodedToken.UID));
                        if (user) {
                            //Check token version
                            if (user.tokenVersion === user.tokenVersion) {
                                user.tokenVersion = user.tokenVersion + 1;
                                yield User.update(decodedToken.UID, firebase_1.DBUsers, { tokenVersion: user.tokenVersion })
                                    .then(() => {
                                    const refreshToken = (0, exports.createToken)(decodedToken.UID, user.tokenVersion, decodedToken.role);
                                    return res.cookie(VITE_OPS_COOKIE_NAME, refreshToken, {
                                        httpOnly: false,
                                        secure: true,
                                        sameSite: "lax"
                                    })
                                        .status(200)
                                        .json({
                                        id: user.id,
                                        username: user.username,
                                        credit: user.credit,
                                        fullname: user.fullname,
                                        role: user.role,
                                        status: user.status,
                                        admin_create_id: user.admin_create_id,
                                        agent_create_id: user.agent_create_id,
                                        manager_create_id: user.manager_create_id,
                                        store_id: user.store_id,
                                        created_at: user.created_at,
                                        updated_at: user.updated_at,
                                        user_create_id: user.user_create_id
                                    });
                                })
                                    .catch(() => {
                                    return res.sendStatus(403);
                                });
                            }
                        }
                    }
                    else {
                        next();
                    }
                }
            }));
        }
        else {
            return res.sendStatus(401);
        }
    }
    catch (error) {
        return res.sendStatus(404);
    }
}
exports.authenticate = authenticate;
const createToken = (UID, tokenVersion, role) => {
    return jsonwebtoken_1.default.sign({ UID, tokenVersion, role }, keys_1.privateKey, {
        algorithm: "RS256",
        expiresIn: "6h",
    });
};
exports.createToken = createToken;
