import { NextFunction, Request, Response } from 'express'
import { APP } from "../main";
import { TUserRole } from "../models/User";
import { authorization } from "../middleware/authorization";
import { HelperController } from "../helpers/Helpers";
import { DBDigitsClose, db, digitsCloseCollectionRef } from '../utils/firebase';
import { doc, query, where } from 'firebase/firestore';
import { IDigitCloseDoc } from './../helpers/Helpers';

const Helpers = new HelperController()

export class ApiDigitClose {
    getDigitCloseId = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
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

    getDigitCloseMe = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
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

    getDigitCloseAll = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
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

    addDigitClose = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
        APP.post(url, middleware, async (req: Request, res: Response) => {
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

    updateDigitClose = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
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

    deleteDigitClose = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void, roles: TUserRole[]) => {
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
