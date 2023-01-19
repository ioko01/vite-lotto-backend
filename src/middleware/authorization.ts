import { Request, Response } from "express";
import jwt_decode from "jwt-decode";
import { IToken } from "../models/Token";
import { TUserRole } from "../models/User";

export function authorization(req: Request, roles: TUserRole[]) {
    try {
        const auth = req.headers.authorization && req.headers.authorization.split(" ");
        if (auth && auth[0] === "Bearer" && auth[1]) {
            const token = auth[1]
            const decodedToken = jwt_decode<IToken>(token);
            if (roles.includes(decodedToken.role)) {
                return decodedToken
            }
        } else {
            return 401
        }
    } catch (error) {
        return 401
    }
}