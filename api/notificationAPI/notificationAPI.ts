import useMyFetch from "@/service/http-request";
import { SetDefaultNotificationAPIReqInterface } from "./notificationAPI-interface";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;

/**
 * 設定登入者預設通知資料
 * @param data
 * @returns
 */
export async function SetDefaultNotificationAPI(data: SetDefaultNotificationAPIReqInterface) {
    return useMyFetch(`${apiNestJSURL}/notification/set-default-data`, { method: "POST", body: JSON.stringify(data) });
}
