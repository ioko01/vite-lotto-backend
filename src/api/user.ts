import config from 'config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import { IUserDoc, UserController } from '../helpers/User';
import { APP } from "../main";
import { getDocs } from 'firebase/firestore';

const Users = new UserController()

export const excludedFields = ['password']
const accessTokenCookieOptions: CookieOptions = {
    expires: new Date(
        Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
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
        APP.post(url, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const data = req.body
                await Users.add(data)
                    .then(() => {
                        res.send({ statusCode: res.statusCode, message: "OK" })
                    })
                    .catch(error => {
                        res.send({ statusCode: res.statusCode, message: error })
                    });

                res.status(201).json({
                    status: 'success',
                });
            } catch (err: any) {
                if (err.code === 11000) {
                    return res.status(409).json({
                        status: 'fail',
                        message: 'username already exist',
                    });
                }
                next(err);
            }
        })
    }

    login = (url: string) => {
        APP.post(url, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { docs } = await getDocs(req.body.username)

                if (!docs) return next(new AppError('Invalid username or password', 401));

                docs.map(async (doc) => {
                    const data = doc.data() as IUserDoc
                    const { access_token } = await new UserController().signToken(data);

                    res.cookie('accessToken', access_token, accessTokenCookieOptions);
                    res.cookie('logged_in', true, {
                        ...accessTokenCookieOptions,
                        httpOnly: false,
                    });

                    res.status(200).json({
                        status: 'success',
                        access_token,
                    });
                })
            } catch (err: any) {
                next(err);
            }
        })
    }

    addAdmin = (url: string) => {
        APP.post(url, async (req: Request, res: Response) => {
            try {
                const data = req.body
                await Users.addAdmin(data)
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
