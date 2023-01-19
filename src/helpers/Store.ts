import { IStore } from "../models/Store";
import { db } from "../utils/firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

export interface IStoreDoc extends IStore {
    id: string;
}

const Stores = "stores"
const storeCollectionRef = collection(db, Stores)

export class StoreController {

    get = async () => {
        const { docs } = await getDocs(storeCollectionRef)
        return docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as IStoreDoc
        })
    }

    add = async (store: IStore) => {
        return await addDoc(storeCollectionRef, store)
    }

    update = async (id: string, store: IStore) => {
        const tutorialDoc = doc(db, Stores, id)
        return await updateDoc(tutorialDoc, Stores, store)
    }
}