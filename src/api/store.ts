import { StoreController } from "../helpers/Store";
import { NextFunction, Request, Response } from 'express'
import { APP } from "../main";

const Stores = new StoreController()

export class ApiStore {
    get = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void) => {
        APP.get(url, middleware, async (_: Request, res: Response) => {
            const snapshot = await Stores.get()
            snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
        })
    }

    add = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void) => {
        APP.post(url, middleware, async (req: Request, res: Response) => {
            try {
                const data = req.body
                await Stores.add(data)
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

    update = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void) => {
        APP.put(url, middleware, async (req: Request, res: Response) => {
            try {
                const data = req.body
                await Stores.update("1", data)
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

    delete = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => void) => {

    }
}
