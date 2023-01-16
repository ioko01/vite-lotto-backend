import { BillController } from "../helpers/Bill";
import { NextFunction, Request, Response } from 'express'
import { APP } from "../main";

const Bills = new BillController()

export class ApiBill {
    get = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
        APP.get(url, middleware, async (_: Request, res: Response) => {
            const snapshot = await Bills.get()
            snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
        })
    }

    add = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
        APP.post(url, middleware, async (req: Request, res: Response) => {
            try {
                const data = req.body
                await Bills.add(data)
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

    update = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
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

    delete = (url: string, middleware: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {

    }
}
