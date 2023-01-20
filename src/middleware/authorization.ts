import { Request, Response } from "express";
import jwt_decode from "jwt-decode";
import { IToken } from "../models/Token";
import { TUserRole } from "../models/User";
import { HelperController, IUserDoc } from "../helpers/Helpers";
import { doc } from "firebase/firestore";
import { DBUsers, db } from "../utils/firebase";

export async function authorization(req: Request, roles: TUserRole[]) {
    try {
        const auth = req.headers.authorization && req.headers.authorization.split(" ");
        if (auth && auth[0] === "Bearer" && auth[1]) {
            const token = auth[1]
            const decodedToken = jwt_decode<IToken>(token)
            const Helpers = new HelperController()
            const user = await Helpers.getId(doc(db, DBUsers, decodedToken.UID)) as IUserDoc
            if (decodedToken.tokenVersion === user.tokenVersion) {
                if (roles.includes(decodedToken.role)) return decodedToken
                return 401
            }
            return 401
        }
        return 401
    } catch (error) {
        return 401
    }
}