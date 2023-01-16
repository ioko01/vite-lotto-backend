import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { createToken, sendToken, verifyToken } from "./helpers/Token";
import { APP } from "./main";
import { AppContext } from "./models/AppContext";
import { db } from "./utils/firebase";

const { COOKIE_NAME } = process.env;
export default async () => {
    async ({ req, res }: AppContext) => {
        try {
            const token = req.cookies[COOKIE_NAME!];
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
                        const Users = "users"
                        const userCollectionRef = collection(db, Users)
                        const q = query(userCollectionRef, where("id", "==", req.UID))
                        const { docs } = await getDocs(q)

                        if (docs.length > 0) {
                            docs.map(async (doc) => {
                                //Check token version
                                if (doc.data().tokenVersion === req.tokenVersion) {
                                    doc.data().tokenVersion = doc.data().tokenVersion + 1;
                                    const updateUser = await addDoc(userCollectionRef, doc.data());

                                    if (updateUser) {
                                        const token = createToken(
                                            doc.data().id,
                                            doc.data().tokenVersion
                                        );

                                        req.tokenVersion =
                                            doc.data().tokenVersion;

                                        sendToken(res, token);
                                    }
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
}