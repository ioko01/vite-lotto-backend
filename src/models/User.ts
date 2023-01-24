import { IInitialState } from "./Main"
import { IStore } from "./Store"

export type TUserRole = "ADMIN" | "AGENT" | "MANAGER" | "MEMBER" | "MANAGE_REWARD"
export type TUserStatus = "REGULAR" | "CLOSED" | "BANNED"

export enum TUserRoleEnum {
    ADMIN = "ADMIN",
    AGENT = "AGENT",
    MANAGER = "MANAGER",
    MEMBER = "MEMBER",
    MANAGE_REWARD = "MANAGE_REWARD"
}

export enum TUserStatusEnum {
    REGULAR = "REGULAR",
    CLOSED = "CLOSED",
    BANNED = "BANNED",
}

export interface IUser extends IInitialState {
    store_id?: string
    username: string
    password: string
    fullname: string
    role: TUserRole
    status: TUserStatus
    credit: number
    tokenVersion?: number
}