import { BillController, IBillDoc } from "../helpers/Bill";
import { NextFunction, Request, Response } from 'express'
import { APP } from "../main";
import { IToken } from "../models/Token";
import jwt_decode from "jwt-decode";
import { IUser, TUserRole } from "../models/User";
import { authorization } from "../middleware/authorization";
import { billsCollectionRef } from "../utils/firebase";
import { query, where } from "firebase/firestore";
import { IBill } from "../models/Bill";
import { GMT } from "../utils/time";

const Bills = new BillController()

export class ApiBill {
    getBillMe = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            const authorize = authorization(req, roles)
            if (authorize) {
                if (authorize !== 401) {
                    console.log(authorize.UID);
                    const q = query(billsCollectionRef, where("user_create_id", "==", authorize.UID))
                    const snapshot = await Bills.getContain(q)
                    snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
                } else {
                    return res.sendStatus(authorize)
                }
            } else {
                return res.sendStatus(401)
            }

        })
    }

    getBillAll = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            const authorize = authorization(req, roles)
            if (authorize) {
                if (authorize !== 401) {
                    const snapshot = await Bills.getAll()
                    snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
                } else {
                    return res.sendStatus(authorize)
                }
            } else {
                return res.sendStatus(401)
            }

        })
    }

    addBill = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.post(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body as IBill
                        const bill: IBill = {
                            lotto: data.lotto,
                            note: data.note,
                            rate: data.rate,
                            status: "WAIT",
                            store: data.store,
                            times: data.times,
                            one_digits: data.one_digits,
                            two_digits: data.two_digits,
                            three_digits: data.three_digits,
                            reward: data.reward,
                            created_at: GMT(),
                            updated_at: GMT(),
                            user_create_id: authorize.UID
                        }

                        await Bills.add(bill)
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

    updateBill = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.put(url, middleware, async (req: Request, res: Response) => {
            try {
                const data = req.body
                await Bills.update("1", data)
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

    deleteBill = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.delete(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body as { id: string }
                        await Bills.delete(data.id)
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
}
