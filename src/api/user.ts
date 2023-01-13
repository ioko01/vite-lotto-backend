import { Request, Response } from 'express'
import { APP } from "../main";

export class ApiUser {
    get = (url: string) => {
        APP.get(url, async (res: Response) => {

        })
    }

    add = (url: string) => {
        APP.post(url, async (req: Request, res: Response) => {
            try {


            } catch (error) {
                res.status(res.statusCode).send(error);
            }
        })
    }

    update = (url: string) => {
        APP.put(url, async (req: Request, res: Response) => {
        })
    }

    delete = (url: string) => {

    }
}
