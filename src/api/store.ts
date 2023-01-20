import { NextFunction, Request, Response } from 'express'
import { APP } from "../main";
import { TUserRole } from "../models/User";
import { authorization } from "../middleware/authorization";
import { HelperController } from "../helpers/Helpers";
import { DBStores, storesCollectionRef } from '../utils/firebase';

const Helpers = new HelperController()

export class ApiStore {
    getStoreContain = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            const authorize = await authorization(req, roles)
            if (authorize) {
                if (authorize !== 401) {

                } else {
                    return res.sendStatus(authorize)
                }
            } else {
                return res.sendStatus(401)
            }
        })
    }

    getStoreMe = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            const authorize = await authorization(req, roles)
            if (authorize) {
                if (authorize !== 401) {

                } else {
                    return res.sendStatus(authorize)
                }
            } else {
                return res.sendStatus(401)
            }
        })
    }

    getStoreAll = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.get(url, middleware, async (req: Request, res: Response) => {
            const authorize = await authorization(req, roles)
            if (authorize) {
                if (authorize !== 401) {
                    const snapshot = await Helpers.getAll(storesCollectionRef)
                    snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
                } else {
                    return res.sendStatus(authorize)
                }
            } else {
                return res.sendStatus(401)
            }
        })
    }

    addStore = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.post(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body
                        await Helpers.add(storesCollectionRef, data)
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

    updateStore = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.put(url, middleware, async (req: Request, res: Response) => {
            try {
                const authorize = await authorization(req, roles)
                if (authorize) {
                    if (authorize !== 401) {
                        const data = req.body
                        await Helpers.update("1", DBStores, data)
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

    delete = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void) => {

    }
}
