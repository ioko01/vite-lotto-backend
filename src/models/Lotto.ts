import { IInitialState } from "./Main";

export type TLottoStatus = "OPEN" | "CLOSE"

export interface ILotto extends IInitialState {
    name: string //ชื่อหวย
    img_flag: string //สัญลักษณ์หวย(ธง)
    open: Date //เวลาเปิดรับ
    close: Date //เวลาปิดรับ
    report: Date //เวลาผลออก
    status: TLottoStatus //สถานะหวย
}