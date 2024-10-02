import { getCookie } from "cookies-next";
export default async function useMyFetch(url: string, options: any) {
    // 判斷是 formData 形式上傳資料時 不需要指定 Content-Type
    if (typeof options.headers === "object" && Object.keys(options.headers).length > 0 && options.headers.isFormData) {
        options.headers["Accept"] = "application/json, text/plain, */*";
        if (getCookie("accessToken") || options.token) {
            const token = getCookie("accessToken") ?? options.token;
            options.headers.Authorization = `Bearer ${token}`;
        }
    } else {
        options.headers = {};
        options.headers["Content-Type"] = "application/json";
        options.headers["Accept"] = "application/json, text/plain, */*";
        if (getCookie("accessToken") || options.token) {
            const token = getCookie("accessToken") ?? options.token;
            options.headers.Authorization = `Bearer ${token}`;
        }
    }

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
    } catch (err: any) {
        const errData = await err.json();
        console.log("myFetch error =>", errData);
        throw errData;
    }
}
