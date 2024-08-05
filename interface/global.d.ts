/**
 * 信用卡付款資料
 */
export interface CreditCardDataInterface {
    cardNo: number;
    // 有效日期
    exp: string;
    // 安全碼
    cvc: string;
}
