import bcrypt from "bcrypt";
import { IUser } from "../models/User";
import { TUserRoleEnum } from "../models/User";
import { db } from "../utils/firebase";
import { collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc, where, query, DocumentData } from "firebase/firestore";
import { omit, get } from 'lodash';
import { excludedFields } from "../api/user";
import { signJwt } from "../utils/jwt";
import config from "config";
import redisClient from '../utils/redis';

export interface IUserDoc extends IUser {
    id: string;
}

const Users = "users"
const userCollectionRef = collection(db, Users)

export class UserController {
    get = async () => {
        const { docs } = await getDocs(userCollectionRef)
        return docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as IUserDoc
        })
    }

    add = async (user: IUser) => {
        const addUser = await addDoc(userCollectionRef, user)
        return omit(addUser, excludedFields)
    }

    signToken = async (user: IUserDoc) => {
        const access_token = signJwt(
            { sub: user.id },
            { expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`, }
        );

        redisClient.set(user.id, JSON.stringify(user), {
            EX: 60 * 60,
        });

        return { access_token };
    };

    addAdmin = async (user: IUser) => {
        const q = query(userCollectionRef, where("role", "==", "ADMIN"))
        const { docs } = await getDocs(q)
        if (docs.length > 0) {
            throw new Error("403")
        } else {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const userDoc: IUser = {
                store: user.store,
                fullname: user.fullname,
                username: user.username,
                password: hashedPassword,
                role: "ADMIN",
                status: "REGULAR",
                credit: 0
            }
            return await addDoc(userCollectionRef, userDoc)
        }
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