import { IStore } from "./Store"

export type TUserRole = "ADMIN" | "AGENT" | "MANAGER" | "MEMBER"
export type TUserStatus = "NORMAL" | "CLOSED" | "BANNED"

export interface IUser {
    store?: IStore
    username: string
    password: string
    fullname: string
    role: TUserRole
    status: TUserStatus
    credit: number
}