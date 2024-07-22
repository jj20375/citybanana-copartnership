import useMyFetch from "@/service/http-request";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 取得 footer 資料
 */
export async function GetFooterDatasAPI() {
    return useMyFetch(`${apiURL}/expo/web/footer`, { method: "get" });
}
