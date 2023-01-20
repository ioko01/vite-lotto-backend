import { NextFunction, Request, Response } from 'express'
import { APP } from "../main";
import { TUserRole } from "../models/User";
import { authorization } from "../middleware/authorization";
import { HelperController } from "../helpers/Helpers";
import { DBCheckRewards, db } from '../utils/firebase';
import { doc, query, where } from 'firebase/firestore';
import { ICheckReward } from '../models/CheckReward';
import { checkRewardsCollectionRef } from './../utils/firebase';

const Helpers = new HelperController()

export class ApiCheckReward {
    getCheckRewardId = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const id = req.params as { id: string }
                        const bill = await Helpers.getId(doc(db, DBCheckRewards, id.id))
                        if (!bill) return res.sendStatus(404)
                        return res.json(bill)
                    } else {
                        return res.sendStatus(authorize)
                    }
                } else {
                    return res.sendStatus(401)
                }

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

    getCheckRewardMe = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const q = query(checkRewardsCollectionRef, where("user_create_id", "==", authorize.UID))
                        const snapshot = await Helpers.getContain(q) as ICheckReward[]
                        snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
                    } else {
                        return res.sendStatus(authorize)
                    }
                } else {
                    return res.sendStatus(401)
                }
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

    getCheckRewardAll = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const snapshot = await Helpers.getAll(checkRewardsCollectionRef)
                        snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
                    } else {
                        return res.sendStatus(authorize)
                    }
                } else {
                    return res.sendStatus(401)
                }
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

    addCheckReward = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.post(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body
                        await Helpers.add(checkRewardsCollectionRef, data)
                            .then(() => {
                                res.send({ statusCode: res.statusCode, message: "OK" })
                            })
                            .catch(error => {
                                res.send({ statusCode: res.statusCode, message: error })
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

    updateCheckReward = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.put(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body
                        await Helpers.update("1", DBCheckRewards, data)
                            .then(() => {
                                res.send({ statusCode: res.statusCode, message: "OK" })
                            })
                            .catch(error => {
                                res.send({ statusCode: res.statusCode, message: error })
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

    deleteCheckReward = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.delete(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body as { id: string }
                        await Helpers.delete(data.id, DBCheckRewards)
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
