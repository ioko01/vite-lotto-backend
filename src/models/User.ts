import { IStore } from "./Store"

export type TUserRole = "ADMIN" | "AGENT" | "MANAGER" | "MEMBER"
export type TUserStatus = "REGULAR" | "CLOSED" | "BANNED"

export enum TUserRoleEnum {
    ADMIN = "ADMIN",
    AGENT = "AGENT",
    MANAGER = "MANAGER",
    MEMBER = "MEMBER"
}

export enum TUserStatusEnum {
    REGULAR = "REGULAR",
    CLOSED = "CLOSED",
    BANNED = "BANNED",
}

export interface IUser {
    store?: IStore
    username: string
    password: string
    fullname: string
    role: TUserRole
    status: TUserStatus
    credit: number
    tokenVersion?: number
}