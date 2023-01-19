import { NextFunction, Request, Response } from 'express';
import { UserController } from '../helpers/User';
import { APP } from "../main";
import { getDocs, query, where } from 'firebase/firestore';
import { validatePassword, validateUsername } from '../utils/validate';
import { IUser } from '../models/User';
import { usersCollectionRef } from '../utils/firebase';
import bcrypt from "bcrypt";
import { GMT } from '../utils/time';
import { createToken } from '../middleware/authenticate';
import { config } from "dotenv";

config()

const Users = new UserController()

export class ApiUser {

    get = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void) => {
        APP.get(url, middleware, async (_: Request, res: Response) => {
            const snapshot = await Users.getAll()
            snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
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
                    role: data.role,
                    status: data.status,
                    created_at: GMT(),
                    updated_at: GMT(),
                    user_create_id: "0"
                }

                await Users.create(user)
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
                const users = await Users.getContain(q)

                if (users.length === 0) return res.status(400).send({ message: "No Account" })

                users.map(async (user) => {
                    const isPasswordValid = await bcrypt.compare(
                        data.password,
                        user.password
                    )
                    if (!isPasswordValid) return res.status(400).send({ message: "Invalid Password" })

                    const token = createToken(user.id, user.role)
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

    createAdmin = (url: string) => {
        APP.post(url, async (req: Request, res: Response) => {
            try {
                const data = req.body as IUser
                await Users.createAdmin(data)
                    .then(() => {
                        return res.send({ statusCode: res.statusCode, message: "OK" })
                    })
                    .catch(error => {
                        return res.send({ statusCode: res.statusCode, message: error })
                    })
            } catch (error) {
                return res.status(res.statusCode).send(error);
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
