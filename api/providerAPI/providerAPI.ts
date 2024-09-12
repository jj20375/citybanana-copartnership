import useMyFetch from "@/service/http-request";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 取得服務商資料
 */
export function GetProviderProfileAPI(providerID: string) {
    return useMyFetch(`${apiURL}/providers/${providerID}`, { method: "get" });
}
