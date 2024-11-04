import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "../rightnowactivity-recruitment-order/rightnowactivity-order-interface";
/**
 * 查看訂單細節頁請求資料
 */
export interface OrderDetailViewReqInterface {
    // 即刻快閃 id
    rightNowActivityID: string;
    // 服務商 banana_id
    providerID: string;
    // 報名服務商資料
    providerData?: RightNowActivityOrderDetailProviderSigupCardInterface | void;
}
