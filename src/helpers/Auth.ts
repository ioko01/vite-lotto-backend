import { IUser, TUserRoleEnum, TUserRole, TUserStatusEnum } from "../models/User";
import bcrypt from "bcrypt";
import { usersCollectionRef } from "../utils/firebase";
import { getDocs, where, query } from "firebase/firestore";

export const isAuthenticated = async (UID?: string, tokenVersion?: number) => {
    const q = query(usersCollectionRef, where("id", "==", UID))
    const { docs } = await getDocs(q)

    if (docs.length === 0) throw new Error("please login");

    const user = docs.map((doc) => {
        if (doc.data().status !== TUserRoleEnum.MEMBER)
            throw new Error("not authorization");

        if (tokenVersion !== doc.data().tokenVersion)
            throw new Error("not authentication");

        return doc.data() as IUser
    })
    const isUser = user[0]
    return isUser
};

export const isAuthorization = async (
    UsersModel: IUser,
    authorization: TUserRole | TUserRole[]
) => {

    const isAuthorize = authorization.includes(UsersModel.role)

    if (!isAuthorize || UsersModel.status !== TUserStatusEnum.REGULAR)
        throw new Error("not authorization");

    return true;
};