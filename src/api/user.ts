import { NextFunction, Request, Response } from 'express';
import { APP } from "../main";
import { getDocs, query, where } from 'firebase/firestore';
import { validatePassword, validateUsername } from '../utils/validate';
import { IUser, TUserRole } from '../models/User';
import { DBUsers, usersCollectionRef } from '../utils/firebase';
import bcrypt from "bcrypt";
import { GMT } from '../utils/time';
import { createToken } from '../middleware/authenticate';
import { config } from "dotenv";
import { HelperController, IUserDoc } from '../helpers/Helpers';
import { authorization } from '../middleware/authorization';

config()

const Helpers = new HelperController()

export class ApiUser {

    getUserMe = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const snapshot = await Helpers.getAll(usersCollectionRef) as IUserDoc[]
                        snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
                    } else {
                        return res.sendStatus(authorize)
                    }
                }
            } catch (err: any) {
                res.send(err)
            }
        })
    }

    getUserAll = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const snapshot = await Helpers.getAll(usersCollectionRef) as IUserDoc[]
                        snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
                    } else {
                        return res.sendStatus(authorize)
                    }
                }
            } catch (err: any) {
                res.send(err)
            }
        })
    }

    register = (url: string) => {
        APP.post(url, async (req: Request, res: Response) => {
            try {
                const data = req.body as IUser
                const isValidateUsername = validateUsername(data.username);
                if (!isValidateUsername) throw new Error("username invalid");

                const isValidatePassword = validatePassword(data.password);
                if (!isValidatePassword) throw new Error("password invalid");

                const q = query(usersCollectionRef, where("username", "==", data.username))
                const { docs } = await getDocs(q)

                if (docs.length > 0) res.sendStatus(400).send({ message: "this user is used" })

                const hashedPassword = await bcrypt.hash(data.password, 10);

                const user: IUser = {
                    username: data.username,
                    password: hashedPassword,
                    fullname: data.fullname,
                    credit: data.credit,
                    role: "MEMBER",
                    status: "REGULAR",
                    created_at: GMT(),
                    updated_at: GMT(),
                    tokenVersion: 1
                }

                await Helpers.create(usersCollectionRef, user)
                    .then(async () => {
                        return res.sendStatus(200)
                    })
                    .catch(error => {
                        return res.send({ statusCode: res.statusCode, message: error })
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
                const users = await Helpers.getContain(q) as IUserDoc[]

                if (users.length === 0) return res.status(400).send({ message: "No Account" })

                users.map(async (user) => {
                    const isPasswordValid = await bcrypt.compare(
                        data.password,
                        user.password
                    )
                    if (!isPasswordValid) return res.status(400).send({ message: "Invalid Password" })
                    if (!user.tokenVersion) return res.sendStatus(403)
                    const token = createToken(user.id, user.tokenVersion!, user.role)
                    const COOKIE_NAME = process.env.COOKIE_NAME!
                    res.cookie(COOKIE_NAME!, token, {
                        httpOnly: true,
                        secure: true,
                    })

                    res.json({ token })
                })

            } catch (err: any) {
                res.send(err)
            }
        })
    }

    logout = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.post(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {

                        const data = req.body as IUser
                        const q = query(usersCollectionRef, where("username", "==", data.username))
                        const users = await Helpers.getContain(q) as IUserDoc[]

                        if (users.length === 0) return res.status(400).send({ message: "No Account" })

                        users.map(async (user) => {
                            const COOKIE_NAME = process.env.COOKIE_NAME!
                            const updateToken = { tokenVersion: user.tokenVersion } as IUser

                            Helpers.update(authorize.UID, DBUsers, updateToken)
                            res.clearCookie(COOKIE_NAME!, {
                                httpOnly: true,
                                secure: true,
                            })

                            res.json({ message: "logout" })
                        })
                    } else {
                        return res.sendStatus(authorize)
                    }
                } else {
                    return res.sendStatus(401)
                }
            } catch (err: any) {
                res.send(err)
            }
        })
    }

    update = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.put(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {

                    } else {
                        return res.sendStatus(authorize)
                    }
                } else {
                    return res.sendStatus(401)
                }

            } catch (error) {
                res.status(res.statusCode).send(error);
            }
        })
    }

    delete = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.delete(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body as { id: string }
                        await Helpers.delete(data.id, DBUsers)
                            .then((data) => {
                                if (data === 404) return res.sendStatus(data)
                                return res.send({ statusCode: res.statusCode, message: "OK" })
                            })
                            .catch(error => {
                                return res.send({ statusCode: res.statusCode, message: error })
                            })
                    } else {
                        return res.sendStatus(authorize)
                    }
                } else {
                    return res.sendStatus(401)
                }

            } catch (error) {
                res.status(res.statusCode).send(error);
            }
        })
    }
}
