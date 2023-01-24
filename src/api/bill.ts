import { IBillDoc } from "../helpers/Bill";
import { NextFunction, Request, Response } from 'express'
import { APP } from "../main";
import { TUserRole } from "../models/User";
import { authorization } from "../middleware/authorization";
import { DBBills, DBUsers, billsCollectionRef, db, storesCollectionRef } from "../utils/firebase";
import { DocumentData, Query, doc, documentId, query, where } from "firebase/firestore";
import { IBill } from "../models/Bill";
import { GMT } from "../utils/time";
import { HelperController } from "../helpers/Helpers";

const Helpers = new HelperController()


export class ApiBill {

    getBillAllMe = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const { id } = req.params as { id: string }
                        let q: Query<DocumentData> | undefined = undefined
                        if (authorize.role === "ADMIN") {
                            q = query(billsCollectionRef, where(documentId(), "==", id))
                        } else if (authorize.role === "AGENT") {
                            q = query(billsCollectionRef, where("agent_create_id", "==", authorize.id))
                        } else if (authorize.role === "MANAGER") {
                            q = query(billsCollectionRef, where("agent_create_id", "==", authorize.agent_create_id), where("manager_create_id", "==", authorize.id))
                        }

                        if (!q) return res.sendStatus(403)

                        const getStore = await Helpers.getContain(q)
                        if (getStore.length > 0) {
                            const bill = await Helpers.getId(doc(db, DBBills, id))
                            if (!bill) return res.sendStatus(404)
                            return res.json(bill)
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

    getBillMe = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const q = query(billsCollectionRef, where("user_create_id", "==", authorize.id))
                        const snapshot = await Helpers.getContain(q) as IBillDoc[]
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

    getBillAll = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const snapshot = await Helpers.getAll(billsCollectionRef) as IBillDoc[]
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

    addBill = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.post(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body as IBill
                        if (!data.lotto_id && !data.rate_id && !data.times) return res.sendStatus(403)

                        const bill: IBill = {
                            lotto_id: data.lotto_id,
                            note: data.note,
                            rate_id: data.rate_id,
                            status: "WAIT",
                            store_id: data.store_id,
                            times: data.times,
                            one_digits: data.one_digits,
                            two_digits: data.two_digits,
                            three_digits: data.three_digits,
                            reward: data.reward,
                            created_at: GMT(),
                            updated_at: GMT(),
                            user_create_id: authorize.id
                        }
                        
                        await Helpers.add(billsCollectionRef, bill)
                            .then(() => {

                                await Helpers.update(authorize.id, DBUsers, { credit: })
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
                await Helpers.update("1", DBBills, data)
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
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body as { id: string }
                        await Helpers.delete(data.id, DBBills)
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
