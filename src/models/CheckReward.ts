import { IInitialState } from "./Main";

export interface ICheckReward extends IInitialState {
    lotto_id: string //ไอดีหวย
    times: string //งวดที่ออก
    reward: string //ผลที่ออก (153/68)
}