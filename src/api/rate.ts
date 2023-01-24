import { NextFunction, Request, Response } from 'express'
import { APP } from "../main";
import { TUserRole } from "../models/User";
import { authorization } from "../middleware/authorization";
import { HelperController, IRateDoc } from "../helpers/Helpers";
import { DBLottos, DBRates, DBStores, db, ratesCollectionRef } from './../utils/firebase';
import { DocumentData, Query, doc, documentId, query, where } from 'firebase/firestore';
import { IRate } from '../models/Rate';
import { GMT } from '../utils/time';

const Helpers = new HelperController()

export class ApiRate {
    getRateAllMe = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const { id } = req.params as { id: string }
                        let q: Query<DocumentData> | undefined = undefined
                        if (authorize.role === "ADMIN") {
                            q = query(ratesCollectionRef, where(documentId(), "==", id))
                        } else if (authorize.role === "AGENT") {
                            q = query(ratesCollectionRef, where("user_create_id", "==", authorize.id), where(documentId(), "==", id))
                        } else if (authorize.role === "MANAGER") {
                            q = query(ratesCollectionRef, where("user_create_id", "==", authorize.agent_create_id), where(documentId(), "==", id))
                        }

                        if (!q) return res.sendStatus(403)

                        const getStore = await Helpers.getContain(q)
                        if (getStore.length > 0) {
                            const rate = await Helpers.getId(doc(db, DBRates, id))
                            if (!rate) return res.sendStatus(404)
                            return res.json(rate)
                        }
                        return res.sendStatus(403)
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

    getRateMe = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const q = query(ratesCollectionRef, where("user_create_id", "==", authorize.agent_create_id))
                        const snapshot = await Helpers.getContain(q) as IRateDoc[]
                        if (!snapshot) return res.sendStatus(403)
                        return res.json(snapshot)
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

    getRateAll = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
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

    addRate = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.post(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        if (authorize.role === "AGENT") {
                            const data = req.body as IRate
                            const lotto = await Helpers.getId(doc(db, DBLottos, data.lotto_id))
                            const store = await Helpers.getId(doc(db, DBStores, data.store_id))
                            if (!lotto) return res.status(400).json({ message: "No Lotto" })
                            if (!store) return res.status(400).json({ message: "No Store" })
                            const q = query(ratesCollectionRef, where("store_id", "==", data.store_id), where("lotto_id", "==", data.lotto_id))
                            const checkRate = await Helpers.getContain(q)
                            if (checkRate.length > 0) return res.status(400).json({ message: "this rate has been used" })
                            const rate: IRate = {
                                bet_one_digits: data.bet_one_digits,
                                bet_two_digits: data.bet_two_digits,
                                bet_three_digits: data.bet_three_digits,
                                one_digits: data.one_digits,
                                two_digits: data.two_digits,
                                three_digits: data.three_digits,
                                store_id: data.store_id,
                                lotto_id: data.lotto_id,
                                admin_create_id: authorize.admin_create_id,
                                created_at: GMT(),
                                updated_at: GMT(),
                                user_create_id: authorize.id,
                                committion: data.committion
                            }
                            await Helpers.add(ratesCollectionRef, rate)
                                .then(() => {
                                    return res.send({ statusCode: res.statusCode, message: "OK" })
                                })
                                .catch(error => {
                                    return res.send({ statusCode: res.statusCode, message: error })
                                })
                        }
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

    updateRate = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
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

    deleteRate = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.delete(url, middleware, async (req: Request, res: Response) => {
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
}
