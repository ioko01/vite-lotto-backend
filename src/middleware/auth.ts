import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { privateKey, publicKey } from "../utils/keys";

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization && req.headers.authorization.split(" ");
    if (auth && auth[0] === "Bearer" && auth[1]) {
        const token = auth[1]
        jwt.verify(token, publicKey, {
            algorithms: ["RS256"],
        }, (err) => {
            if (err) return res.sendStatus(401)
            next()
        });
    } else {
        return res.sendStatus(401);
    }
}

export const createToken = (UID: string) => {
    return jwt.sign({ UID }, privateKey, {
        algorithm: "RS256",
        expiresIn: "2d",
    });
};