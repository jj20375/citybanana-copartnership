import useMyFetch from "@/service/http-request";
import type { GetOrderDetailAPIResInterface, GetOrderListAPIResInterface } from "./orderAPI-interface";
import qs from "qs";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;

/**
 * 取得單一訂單資料
 */
export async function GetOrderDetailAPI(orderID: string): Promise<GetOrderDetailAPIResInterface> {
    return useMyFetch(`${apiURL}/datings/${orderID}`, {
        method: "get",
    });
}

/**
 * 取得訂單列表
 */
export async function GetOrderListAPI(params: any): Promise<GetOrderListAPIResInterface> {
    return useMyFetch(`${apiURL}/my/datings?${qs.stringify(params)}`, {
        method: "get",
    });
}
