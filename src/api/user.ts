import { Request, Response } from 'express'
import { APP } from "../main";
import { UserController } from "../helpers/User";

const Users = new UserController
export class ApiUser {
    get = (url: string) => {
        APP.get(url, async (_: Request, res: Response) => {
            const snapshot = await Users.get()
            snapshot ? res.status(200).send(snapshot) : res.status(res.statusCode).send({ statusCode: res.statusCode, statusMessage: res.statusMessage })
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
