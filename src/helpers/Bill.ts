import { IBill } from "../models/Bill";
import { Bills, billsCollectionRef, db } from "../utils/firebase";
import { collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export interface IBillDoc extends IBill {
    id: string;
}

export class BillController {

    get = async () => {
        const { docs } = await getDocs(billsCollectionRef)
        return docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as IBillDoc
        })
    }

    add = async (bill: IBill) => {
        return await addDoc(billsCollectionRef, bill)
    }

    update = async (id: string, bill: IBill) => {
        const tutorialDoc = doc(db, Bills, id)
        return await updateDoc(tutorialDoc, Bills, bill)
    }
}