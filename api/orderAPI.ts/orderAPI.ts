import useMyFetch from "@/service/http-request";
import type { GetOrderDetailAPIResInterface } from "./orderAPI-interface";
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
