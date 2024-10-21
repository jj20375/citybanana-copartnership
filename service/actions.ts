"use server";
// import Cookies from "js-cookie";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { isEmpty } from "@/service/utils";

import dayjs from "dayjs";

import { cookies } from "next/headers";

interface StoreTokenRequest {
    token?: string | null;
    expiresTime: number | null;
    refresh_token?: string;
}

/**
 * 設定伺服器端 cookie token
 * @param request
 */
export async function setToken(request: StoreTokenRequest) {
    console.log("setToken =>", request.token);
    if (!isEmpty(request.expiresTime)) {
        console.log("expiresTime =>", dayjs().add(request.expiresTime!, "second").format("YYYY-MM-DD HH:mm:ss"));
    }
    try {
        cookies().set("accessToken", request.token!, {
            maxAge: request.expiresTime ?? 60 * 60 * 24 * 30,
            httpOnly: true,
            path: "/",
        });
        console.log("set token api success");
    } catch (err) {
        console.log("set token api err =>", err);
    }
    // 設定 token 過期時間 refresh token 預留用
    if (request.expiresTime) {
        cookies().set("expiresTime", String(request.expiresTime), {
            maxAge: request.expiresTime ?? 60 * 60 * 24 * 30,
            httpOnly: true,
            path: "/",
        });
    }
}
