import bcrypt from "bcrypt";
import { IUser, TUserStatusEnum } from "../models/User";
import { TUserRoleEnum } from "../models/User";
import { Users, db, usersCollectionRef } from "../utils/firebase";
import { collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc, where, query, DocumentData } from "firebase/firestore";
import { omit } from 'lodash';
import { excludedFields } from "../api/user";
import { signJwt } from "../utils/jwt";
// import redisClient from '../utils/redis';
import { accessTokenExpiresIn } from "../config/default";
import { validatePassword, validateUsername } from "../utils/validate";
import { isAuthenticated } from "./Auth";
import { GMT } from "../utils/time";

export interface IUserDoc extends IUser {
    id: string;
}

export class UserController {
    get = async () => {
        const { docs } = await getDocs(usersCollectionRef)
        return docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as IUserDoc
        })
    }

    create = async (user: IUser) => {
        return await addDoc(usersCollectionRef, user)
    }

    createAdmin = async (user: IUser) => {
        const q = query(usersCollectionRef, where("role", "==", TUserRoleEnum.ADMIN))
        const { docs } = await getDocs(q)

        if (docs.length === 0) {
            const { credit, fullname, password, role, status, username } = user

            const hashedPassword = await bcrypt.hash(
                password,
                10
            );

            const userObj: IUser = {
                username,
                password: hashedPassword,
                fullname,
                role,
                status,
                credit,
                created_at: GMT(),
                updated_at: GMT()
            }
            await addDoc(usersCollectionRef, userObj)
                .then(() => {
                    return true;
                })
                .catch(() => {
                    return false
                })

        } else {
            return false;
        }
    }

    signToken = async (user: IUserDoc) => {
        const access_token = signJwt(
            { sub: user.id },
            { expiresIn: `${accessTokenExpiresIn}m`, }
        );

        return { access_token };
    };

    addAdmin = async (user: IUser) => {

    }

    update = async (id: string, user: IUser) => {
        const tutorialDoc = doc(db, Users, id)
        return await updateDoc(tutorialDoc, Users, user)
    }
}


// export const createSuperAdmin = async (): Promise<Messages | null> => {


//     if (!user) {
//         const hashedPassword = await bcrypt.hash(
//             process.env.SUPERADMIN_PASSWORD!,
//             10
//         );

//         const createUser = await UsersModel.create({
//             username: process.env.SUPERADMIN_USERNAME!,
//             password: hashedPassword,
//             firstname: "superadmin",
//             lastname: "superadmin",
//             role: UserRolesEnum.SUPER_ADMIN,
//             lastActive: GMT(),
//             updateAt: GMT(),
//             createAt: GMT(),
//         });

//         await createUser.save();

//         return { message: "success", statusCode: 200 };
//     } else {
//         return null;
//     }
// };