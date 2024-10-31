import { getCookie, deleteCookie } from "cookies-next";
import { redirect } from "next/navigation";
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
        // console.log("resData =>", resData);
        const json = await resData.json();
        if (resData.status === 401 && json.message === "Unauthenticated.") {
            deleteCookie("accessToken");
            redirect("/");
            return;
        }
        if (resData.status >= 200 && resData.status < 400) {
            try {
                // console.log("http work", json);
                return json;
            } catch (err) {
                console.log("json error =>", err);
                throw err;
            }
        } else {
            console.log("http false", resData.status, json);
            // return;
            // throw json;
            throw { ...json };
        }
    } catch (err: any) {
        // if (err) {
        //     const errData = await err.json();
        //     console.log("myFetch error =>", errData);
        //     return errData;
        // }
        console.log("http false3", JSON.stringify(err));
        throw err;
    }
}
