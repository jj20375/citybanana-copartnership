import useMyFetch from "@/service/http-request";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;

/**
 * 取得 footer 資料
 */
export async function GetFooterDatasAPI() {
    return useMyFetch(`${apiURL}/expo/web/footer`, { method: "get" });
}

/**
 * 取得顯示或是其他設定資料
 */
export async function GetConfigurationSetingsAPI() {
    return useMyFetch(`${apiURL}/dictionaries/configurations`, { method: "get" });
}
