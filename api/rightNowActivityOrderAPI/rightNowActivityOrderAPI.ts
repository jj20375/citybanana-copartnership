import useMyFetch from "@/service/http-request";
import type { ChangeRightNowActivityProviderRequiredAPIReqInterface, ChangeRightNowActivityProviderRequiredAPIResInterface, GetRightNowActivityOrderDetailAPIResInterface } from "./rightNowActivityOrderAPI-interface";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;

/**
 * 取得即刻快閃單一訂單資料
 */
export async function GetRightNowActivityOrderDetailAPI(orderID: string): Promise<GetRightNowActivityOrderDetailAPIResInterface> {
    return useMyFetch(`${apiURL}/my/demands/datings/${orderID}`, {
        method: "get",
    });
}

/**
 * 更改即刻快閃單服務商需求數量
 */
export async function ChangeRightNowActivityProviderRequiredAPI(data: ChangeRightNowActivityProviderRequiredAPIReqInterface): Promise<ChangeRightNowActivityProviderRequiredAPIResInterface> {
    return useMyFetch(`${apiURL}/my/demands/datings/${data.orderID}`, {
        method: "patch",
        body: JSON.stringify({ provider_required: data.provider_required }),
    });
}

/**
 *
 */
