import dotenv from "dotenv";
import { AppContext } from "../models/AppContext";
import { createToken, sendToken, verifyToken } from "../helpers/Token";
import { getDocs, where, query, doc, updateDoc } from "firebase/firestore";
import { Users, db, usersCollectionRef } from "../utils/firebase";
import { IUserDoc } from "../helpers/User";

dotenv.config()
const { COOKIE_NAME } = process.env;

export const auth = async ({ req, res }: AppContext) => {
    const token = req.cookies[COOKIE_NAME!];
    try {
        if (token) {
            const decodedToken = verifyToken(token) as {
                UID: string;
                tokenVersion: number;
                iat: number;
                exp: number;
            } | null;

            if (decodedToken) {
                req.UID = decodedToken.UID;
                req.tokenVersion = decodedToken.tokenVersion;

                //Check 1 hr to create token
                if (
                    Date.now() / 1000 - decodedToken?.iat >
                    60 * 60 * 1
                ) {
                    const q = query(usersCollectionRef, where("id", "==", req.UID))
                    const { docs } = await getDocs(q)

                    if (docs.length > 0) {
                        docs.map(async (u) => {
                            const user = u.data() as IUserDoc
                            if (user.tokenVersion === req.tokenVersion) {
                                user.tokenVersion = user.tokenVersion! + 1;
                                const UserlDoc = doc(db, Users, req.UID!)
                                await updateDoc(UserlDoc, Users, user)
                                    .then(() => {
                                        const token = createToken(
                                            user.id,
                                            user.tokenVersion!
                                        );

                                        req.tokenVersion =
                                            user.tokenVersion;

                                        sendToken(res, token);
                                    })
                            }
                        })
                    }
                }
            }
        }
    } catch (error) {
        req.UID = undefined;
        req.tokenVersion = undefined;
    }
    return { req, res };
}

