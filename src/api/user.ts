import config from 'config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import { IUserDoc, UserController } from '../helpers/User';
import { APP } from "../main";
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { accessTokenExpiresIn } from "../config/default";
import { AppContext } from '../models/AppContext';
import { validatePassword, validateUsername } from '../utils/validate';
import { isAuthenticated, isAuthorization } from '../helpers/Auth';
import { IUser, TUserRole, TUserRoleEnum } from '../models/User';
import { usersCollectionRef } from '../utils/firebase';
import bcrypt from "bcrypt";
import { GMT } from '../utils/time';
import { createToken, sendToken } from '../helpers/Token';

const Users = new UserController()

export const excludedFields = ['password']
const accessTokenCookieOptions: CookieOptions = {
    expires: new Date(
        Date.now() + accessTokenExpiresIn * 60 * 1000
    ),
    maxAge: accessTokenExpiresIn * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
};

if (process.env.NODE_ENV === 'production') accessTokenCookieOptions.secure = true;

export class ApiUser {

    get = (url: string) => {
        APP.get(url, async (_: Request, res: Response) => {
            const snapshot = await Users.get()
            snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
        })
    }

    register = (url: string) => {
        APP.post(url, async (req: Request, res: Response) => {
            try {
                const data = req.body as IUserDoc
                const isValidateUsername = validateUsername(data.username);
                if (!isValidateUsername) throw new Error("username invalid");

                const isValidatePassword = validatePassword(data.password);
                if (!isValidatePassword) throw new Error("password invalid");

                const isUser = await isAuthenticated(data.id, data.tokenVersion);
                await isAuthorization(isUser, [TUserRoleEnum.ADMIN]);

                const q = query(usersCollectionRef, where("username", "==", data.username))
                const { docs } = await getDocs(q)

                if (docs.length > 0) throw new Error("this user is used");

                const hashedPassword = await bcrypt.hash(data.password, 10);


                const user: IUser = {
                    username: data.username,
                    password: hashedPassword,
                    fullname: data.fullname,
                    credit: data.credit,
                    role: data.role,
                    status: data.status,
                    created_at: GMT(),
                    updated_at: GMT(),
                    user_create_id: "0"
                }
                await Users.create(user)
                    .then(() => {
                        res.send({ statusCode: res.statusCode, message: "OK" })
                    })
                    .catch(error => {
                        res.send({ statusCode: res.statusCode, message: error })
                    })

            } catch (err: any) {
                if (err.code === 11000) {
                    return res.status(409).json({
                        status: 'fail',
                        message: 'username already exist',
                    });
                }
            }
        })
    }

    login = (url: string) => {
        APP.post(url, async (req: Request, res: Response) => {
            try {
                const data = req.body as IUser
                const q = query(usersCollectionRef, where("username", "==", data.username))
                const { docs } = await getDocs(q)

                if (docs.length === 0) throw new Error("no account")
                const user = docs[0].data() as IUserDoc
                const isPasswordValid = await bcrypt.compare(
                    data.password,
                    user.password
                );

                if (!isPasswordValid) throw new Error("no account");

                await isAuthenticated(user.id, user.tokenVersion);
                await isAuthorization(user, [
                    TUserRoleEnum.ADMIN,
                    TUserRoleEnum.AGENT,
                    TUserRoleEnum.MANAGER,
                    TUserRoleEnum.MEMBER,
                ]);

                const token = createToken(user.id, user.tokenVersion!);

                sendToken(res, token);

                res.send(user)
            } catch (err: any) {
                res.send(err)
            }
        })
    }

    createAdmin = (url: string) => {
        APP.post(url, async (req: Request, res: Response) => {
            try {
                const data = req.body as IUser
                await Users.createAdmin(data)
                    .then(() => {
                        res.send({ statusCode: res.statusCode, message: "OK" })
                    })
                    .catch(error => {
                        res.send({ statusCode: res.statusCode, message: error })
                    })
            } catch (error) {
                res.status(res.statusCode).send(error);
            }
        })
    }

    update = (url: string) => {
        APP.put(url, async (req: Request, res: Response) => {
        })
    }

    delete = (url: string) => {

    }
}
