import useMyFetch from "@/service/http-request";
import useSWR from "swr";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 取得使用者資料
 *  因應 server side 機制 因次 跑在 server 端的組件
 * 需要傳送 jwt token
 * @param token jwt token
 * @returns
 */
export async function GetUserProfileAPI(token?: string) {
    const reqURL = `${apiURL}/auth/user-profile`;
    const options: { method: string; token?: string } = { method: "get" };
    if (token) {
        options.token = token;
    }
    return useMyFetch(reqURL, options);
}
/**
 * 登入使用者
 * @returns
 */
export async function LoginUserAPI({ phone, password }: { phone: string; password: string }) {
    // return axios.post(`${apiURL}/auth/login`, { phone, password });
    return useMyFetch(`${apiURL}/auth/login`, {
        method: "post",
        body: JSON.stringify({
            phone,
            password,
        }),
    });
}
/**
 * 取得 firebase 客製化憑證
 * @returns
 */
export async function GetFirebaseCustomTokenAPI(token?: string) {
    const reqURL = `${apiURL}/chat/tokens`;
    const options: { method: string; token?: string } = { method: "post" };
    if (token) {
        options.token = token;
    }
    console.log("GetFirebaseCustomTokenAPI token => ", options);
    return useMyFetch(reqURL, options);
}
export async function GetIndexAPI() {
    return useMyFetch(`${apiURL}/expo/web/index`, {
        method: "get",
    });
}
export async function GetIndexAPI2() {
    return await useMyFetch(`${apiURL}/expo/web/index`, {
        method: "get",
    });
}
