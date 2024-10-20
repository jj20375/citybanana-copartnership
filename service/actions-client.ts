"use client";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { isEmpty } from "./utils";
import dayjs from "dayjs";
import { GetFirebaseCustomTokenAPI } from "@/api/userAPI/userAPI";
import { RefreshTokenAPI } from "@/api/authAPI/authAPI";

interface StoreTokenRequest {
    token?: string | null;
    expiresTime: number | null;
    refresh_token?: string;
}

/**
 * 設定瀏覽器端 cookie token
 * @param request
 */
export async function setClientToken(request: StoreTokenRequest) {
    console.log("setClientToken =>", request.token);
    setCookie("accessToken", request.token!, { maxAge: request.expiresTime ?? 60 * 60 * 24 * 30 });
}

/**
 * 設定 firebase 重取時間
 * @param request
 */
export async function setFirebaseToken(request: StoreTokenRequest) {
    setCookie("expiresFirebaseTokenTime", request.expiresTime, {
        maxAge: request.expiresTime ?? 60 * 60,
        httpOnly: false,
    });
}

export async function refreshToken(request: StoreTokenRequest) {
    // 取得  token 過期 時間
    const expiresTime = request.expiresTime;
    // 判斷沒有 token 過期 時間不執行
    if (isEmpty(expiresTime)) {
        console.log("expiresTime isEmpty =>", expiresTime, dayjs().format("YYYY-MM-DD HH:mm:ss"));
        return;
    }
    // 重取 token 時間 設定為 過期前五天
    const refreshTime = dayjs().add(Number(expiresTime), "second").subtract(5, "day");

    // 判斷現在時間小於 refresh token 時間不執行
    if (refreshTime < dayjs().add(Number(expiresTime), "second")) {
        console.log("expiresTime 不需 refresh time =>", refreshTime.format("YYYY-MM-DD"), dayjs().add(Number(expiresTime), "second").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD"), request);
        return;
    }
    try {
        const data = await RefreshTokenAPI(request.token ? request.token : null);
        setCookie("accessToken", data.access_token, {
            maxAge: data.expires_in,
            httpOnly: false,
        });

        setCookie("expiresTime", data.expires_in, {
            maxAge: data.expires_in,
            httpOnly: false,
        });
        console.log("expiresTime =>", dayjs().add(data.expires_in, "second").format("YYYY-MM-DD HH:mm:ss"));
        return;
    } catch (err) {
        console.log("refresh token err =>", err);
        // 移除 token 時效時間
        deleteCookie("expiresTime");
        // 移除 token
        deleteCookie("accessToken");
        return;
    }
}

/**
 * 重取 firebsae token
 * ps. firebase 只有一小時時效
 * @param request
 * @returns
 */
export async function refreshFirebaseToken(request: StoreTokenRequest) {
    // 取得  token 過期 時間
    const expiresTime = request.expiresTime;
    // 判斷沒有 token 過期 時間不執行
    if (isEmpty(expiresTime)) {
        console.log("expiresFirebaseTime isEmpty =>", expiresTime, dayjs().format("YYYY-MM-DD HH:mm:ss"));
        return;
    }
    // 重取 token 時間 設定為 過期前 20分鐘
    const refreshTime = dayjs().add(Number(expiresTime), "second").subtract(20, "minute");

    // 判斷現在時間小於 refresh token 時間不執行
    if (refreshTime < dayjs().add(Number(expiresTime), "second")) {
        console.log("expiresFirebaseTime 不需 refresh time =>", refreshTime.format("YYYY-MM-DD"), dayjs().add(Number(expiresTime), "second").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD"), request);
        return;
    }
    try {
        await GetFirebaseCustomTokenAPI(request.token!);

        setCookie("expiresFirebaseTokenTime", expiresTime, {
            maxAge: expiresTime!,
            httpOnly: false,
        });
        console.log("expiresFirebaseTime =>", dayjs().add(expiresTime!, "second").format("YYYY-MM-DD HH:mm:ss"));
        return;
    } catch (err) {
        console.log("refresh firebase token err =>", err);
        // 移除 token 時效時間
        deleteCookie("expiresFirebaseTokenTime");
        return;
    }
}
