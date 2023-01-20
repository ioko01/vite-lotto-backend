import { NextFunction, Request, Response } from 'express'
import { APP } from "../main";
import { TUserRole } from "../models/User";
import { authorization } from "../middleware/authorization";
import { DBBills, DBLottos, db, lottosCollectionRef } from "../utils/firebase";
import { doc, query, where } from "firebase/firestore";
import { GMT } from "../utils/time";
import { HelperController, ILottoDoc } from "../helpers/Helpers";
import { ILotto } from "../models/Lotto";

const Helpers = new HelperController()


export class ApiLotto {

    getLottoId = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            const authorize = await authorization(req, roles)
            if (authorize) {
                if (authorize !== 401) {
                    const data = req.body as { id: string }
                    const lotto = await Helpers.getId(doc(db, DBLottos, data.id))
                    return res.json(lotto)
                } else {
                    return res.sendStatus(authorize)
                }
            } else {
                return res.sendStatus(401)
            }

        })
    }

    getLottoMe = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            const authorize = await authorization(req, roles)
            if (authorize) {
                if (authorize !== 401) {
                    const q = query(lottosCollectionRef, where("user_create_id", "==", authorize.UID))
                    const snapshot = await Helpers.getContain(q) as ILottoDoc[]
                    snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
                } else {
                    return res.sendStatus(authorize)
                }
            } else {
                return res.sendStatus(401)
            }

        })
    }

    getLottoAll = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            const authorize = await authorization(req, roles)
            if (authorize) {
                if (authorize !== 401) {
                    const snapshot = await Helpers.getAll(lottosCollectionRef) as ILottoDoc[]
                    snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
                } else {
                    return res.sendStatus(authorize)
                }
            } else {
                return res.sendStatus(401)
            }

        })
    }

    addLotto = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.post(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body as ILotto
                        const lotto: ILotto = {
                            name: data.name,
                            img_flag: data.img_flag,
                            open: data.open,
                            close: data.close,
                            report: data.report,
                            status: data.status,
                            created_at: GMT(),
                            updated_at: GMT(),
                            user_create_id: authorize.UID
                        }

                        await Helpers.add(lottosCollectionRef, lotto)
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

    updateLotto = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
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

    deleteLotto = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.delete(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body as { id: string }
                        await Helpers.delete(data.id, DBLottos)
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
