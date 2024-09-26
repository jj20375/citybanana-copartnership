/**
 * 即刻快閃付款資料
 */
export interface RightNowActivityOrderPaymentFormInterface {
    payment: {
        // 判斷是否需要輸入姓名
        needName: boolean;
        // 聯絡姓名
        contactName?: string;
        // 性別
        gender?: "female" | "male" | null;
        // 付款方式
        paymentMethod: "cash" | "credit";
        // 選擇信用卡卡號
        creditCardChoose?: string | null | void;
    };
}
