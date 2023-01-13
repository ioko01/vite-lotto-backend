import { IDigitPosition } from "./DigitPosition";
import { ILotto } from "./Lotto";
import { IInitialState } from "./Main";
import { IStore } from "./Store";

export interface IRate extends IInitialState {
    store: IStore //ไอดีร้าน
    lotto: ILotto //ไอดีหวย
    one_digits: IDigitPosition //ราคาจ่ายเลขวิ่ง ราคาจ่ายบน/ราคาจ่ายล่าง ==> {top:3, bottom: 4}
    two_digits: IDigitPosition //ราคาจ่ายเลข 2 ตัว ราคาจ่ายบน/ราคาจ่ายล่าง ==> {top:95, bottom:95}
    three_digits: IDigitPosition //ราคาจ่ายเลข 3 ตัว  ราคาจ่ายบน/ราคาจ่ายโต๊ด ==> {top:800, toad:125}
    bet_one_digits: IDigitPosition //อัตาแทงต่ำสุด/สูงสุด/รับได้เยอะสุด เลขวิ่ง ==> {top: 1:100000:100000, bottom: 1:100000:100000, toad: 1:100000:100000}
    bet_two_digits: IDigitPosition //อัตาแทงต่ำสุด/สูงสุด/รับได้เยอะสุด เลข 2 ตัว ==> {top: 1:100000:100000, bottom: 1:100000:100000, toad: 1:100000:100000}
    bet_three_digits: IDigitPosition //อัตาแทงต่ำสุด/สูงสุด/รับได้เยอะสุด เลข 3 ตัว ==> {top: 1:100000:100000, bottom: 0:0:0, toad: 1:100000:100000}
}