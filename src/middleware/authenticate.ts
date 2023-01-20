import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { privateKey, publicKey } from "../utils/keys";
import { TUserRole } from "../models/User";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const auth = req.headers.authorization && req.headers.authorization.split(" ");
        if (auth && auth[0] === "Bearer" && auth[1]) {
            const token = auth[1]
            jwt.verify(token, publicKey, {
                algorithms: ["RS256"],
            }, (err) => {
                if (err) return res.sendStatus(401)
                next()
            })
        } else {
            return res.sendStatus(401)
        }
    } catch (error) {
        return res.sendStatus(404)
    }
}

export const createToken = (UID: string, tokenVersion: number, role: TUserRole) => {
    return jwt.sign({ UID, tokenVersion, role }, privateKey, {
        algorithm: "RS256",
        expiresIn: "2d",
    });
};

export function destroyToken(UID: string, role: TUserRole) {
    return jwt.sign({ UID, role }, privateKey, {
        algorithm: "RS256",
        expiresIn: "0ms",
    });
}