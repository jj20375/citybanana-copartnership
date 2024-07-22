import { getCookie } from "cookies-next";
export default async function useMyFetch(url: string, options: any) {
    options.headers = {};
    if (getCookie("accessToken") || options.token) {
        const token = getCookie("accessToken") ?? options.token;
        options.headers.Authorization = `Bearer ${token}`;
    }
    options.headers["Accept"] = "application/json, text/plain, */*";
    options.headers["Content-Type"] = "application/json";

    // console.log("useMyfetch url =>", url);
    // console.log("useMyfetch options =>", options);

    try {
        const resData = await fetch(url, options);
        if (resData.status >= 200 && resData.status < 400) {
            try {
                return await resData.json();
            } catch (err) {
                console.log("json error =>", err);
                throw err;
            }
        } else {
            throw resData;
        }
    } catch (err) {
        console.log("myFetch error =>", err);
        throw err;
    }
}
