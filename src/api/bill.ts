import Bills from "../helpers/Bill";
import { Request, Response } from 'express'
import { APP } from "../main";

export class ApiBill {
    get = (url: string) => {
        APP.get(url, async (res: Response) => {
            const snapshot = await Bills.get()
            snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
        })
    }

    add = (url: string) => {
        APP.post(url, async (req: Request, res: Response) => {
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

    update = (url: string) => {
        APP.put(url, async (req: Request, res: Response) => {
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

    delete = (url: string) => {

    }
}
