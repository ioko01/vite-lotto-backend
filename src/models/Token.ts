import { TUserRole } from "./User"

export interface IToken {
    UID: string
    role: TUserRole
    iat: Date
    exp: Date
}