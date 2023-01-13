import { IDigitPosition } from "./DigitPosition";
import { ILotto } from "./Lotto";
import { IInitialState } from "./Main";
import { IRate } from "./Rate";
import { IStore } from "./Store";

export interface IDigitSemi extends IInitialState {
    store: IStore //ไอดีร้าน
    lotto: ILotto //ไอดีหวย
    rate: IRate //ไอดีเรทการจ่าย
    percent: number //เปอร์เซ้นต์การจ่าย ค่าเริ่มต้น 50
    one_digits?: IDigitPosition //วิ่ง ==> {top: [1, 2, 3], bottom: [1, 2, 3]}
    two_digits?: IDigitPosition //2 ตัว {top: [01, 22, 63], bottom: [81, 52, 63]}
    three_digits?: IDigitPosition //3 ตัว {top: [051, 222, 631], toad:[831, 542, 673]}
}