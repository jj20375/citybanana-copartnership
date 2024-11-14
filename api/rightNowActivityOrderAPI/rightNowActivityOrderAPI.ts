import useMyFetch from "@/service/http-request";
import type {
    ChangeRightNowActivityProviderRequiredAPIReqInterface,
    ChangeRightNowActivityProviderRequiredAPIResInterface,
    GetRightNowActivityOrderDetailAPIReqInterface,
    GetRightNowActivityOrderDetailAPIResInterface,
    GetRightNowActivityOrderListAPIResInterface,
    GetRightNowActivityOrderPaidAPIResInterface,
} from "./rightNowActivityOrderAPI-interface";
import qs from "qs";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;

/**
 * 取得即刻快閃單一訂單資料
 */
export async function GetRightNowActivityOrderDetailAPI({ orderID, params }: { orderID: string; params?: GetRightNowActivityOrderDetailAPIReqInterface }): Promise<GetRightNowActivityOrderDetailAPIResInterface> {
    if (params) {
        return useMyFetch(`${apiURL}/my/demands/datings/${orderID}?${qs.stringify(params)}`, {
            method: "GET",
        });
    }
    return useMyFetch(`${apiURL}/my/demands/datings/${orderID}`, {
        method: "GET",
    });
}

/**
 * 更改即刻快閃單服務商需求數量
 */
export async function ChangeRightNowActivityProviderRequiredAPI(data: ChangeRightNowActivityProviderRequiredAPIReqInterface): Promise<ChangeRightNowActivityProviderRequiredAPIResInterface> {
    return useMyFetch(`${apiURL}/partner/demands/datings/${data.orderID}`, {
        method: "PATCH",
        body: JSON.stringify({ provider_required: data.provider_required }),
    });
}

/**
 * 取得即刻快閃列表
 */
export async function GetRightNowActivityOrderListAPI(params: any): Promise<GetRightNowActivityOrderListAPIResInterface> {
    return useMyFetch(`${apiURL}/my/demands/datings?${qs.stringify(params)}`, {
        method: "GET",
    });
    // return useMyFetch(`${apiURL}/my/demands/datings?status[]=3`, {
    //     method: "GET",
    // });
}

/**
 * 取得即刻快閃訂單付款金額
 */
export async function GetRightNowActivityOrderPaidAPI(orderID: string): Promise<GetRightNowActivityOrderPaidAPIResInterface> {
    return useMyFetch(`${apiURL}/my/demands/datings/${orderID}/paid`, {
        method: "GET",
    });
}
