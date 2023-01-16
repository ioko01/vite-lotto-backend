import { IUser, TUserRoleEnum, TUserRole, TUserStatusEnum } from "../models/User";
import bcrypt from "bcrypt";
import { db } from "../utils/firebase";
import { collection, getDocs, where, query } from "firebase/firestore";

const Users = "users"
const userCollectionRef = collection(db, Users)

export const isAuthenticated = async (UID?: string, tokenVersion?: number) => {
    const q = query(userCollectionRef, where("id", "==", UID))
    const { docs } = await getDocs(q)

    if (docs.length === 0) throw new Error("please login");

    docs.map((doc) => {
        if (doc.data().status !== TUserRoleEnum.MEMBER)
            throw new Error("not authorization");

        if (tokenVersion !== doc.data().tokenVersion)
            throw new Error("not authentication");

        return doc.data()
    })

};

export const isAuthorization = async (
    UsersModel: IUser,
    authorization: TUserRole
) => {

    const isAuthorize = authorization === UsersModel.role

    if (!isAuthorize || UsersModel.status !== TUserStatusEnum.REGULAR)
        throw new Error("not authorization");

    return true;
};