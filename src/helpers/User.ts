import bcrypt from "bcrypt";
import { IUser } from "../models/User";
import { TUserRoleEnum } from "../models/User";
import { db } from "../utils/firebase";
import { collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export interface IUserDoc extends IUser {
    id: string;
}

const Users = "users"
const userCollectionRef = collection(db, Users)

class UserController {
    get = async () => {
        const { docs } = await getDocs(userCollectionRef)
        return docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as IUserDoc
        })
    }

    add = async (user: IUser) => {
        const { docs } = await getDocs(userCollectionRef)

        docs.map((doc) => {
            console.log(doc.data()['role'])
        })
        // return await addDoc(userCollectionRef, user)
    }

    update = async (id: string, user: IUser) => {
        const tutorialDoc = doc(db, Users, id)
        return await updateDoc(tutorialDoc, Users, user)
    }
}

export default new UserController()

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