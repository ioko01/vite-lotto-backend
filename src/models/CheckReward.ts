import { ILottoDoc } from "../helpers/Default";
import { ILotto } from "./Lotto";
import { IInitialState } from "./Main";

export interface ICheckReward extends IInitialState {
    lotto_id: ILottoDoc //ไอดีหวย
    times: string //งวดที่ออก
    reward: string //ผลที่ออก (153/68)
}