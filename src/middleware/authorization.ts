import { Request } from "express";
import jwt_decode from "jwt-decode";
import { IToken } from "../models/Token";
import { TUserRole } from "../models/User";
import { HelperController, IUserDoc } from "../helpers/Helpers";
import { doc } from "firebase/firestore";
import { DBUsers, db } from "../utils/firebase";

export async function authorization(req: Request, roles: TUserRole[]) {
    try {
        const COOKIE_NAME = process.env.COOKIE_NAME!
        const auth = req.cookies[COOKIE_NAME]
        if (auth) {
            const token = auth
            const decodedToken = jwt_decode<IToken>(token)
            const Helpers = new HelperController()
            const user = await Helpers.getId(doc(db, DBUsers, decodedToken.UID)) as IUserDoc

            if (decodedToken.tokenVersion === user.tokenVersion) {
                const isUser: IUserDoc = {
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
                    password: user.password
                }

                if (roles.includes(decodedToken.role)) return isUser
                return 401
            }
            return 401
        }
        return 401
    } catch (error) {
        return 401
    }
}