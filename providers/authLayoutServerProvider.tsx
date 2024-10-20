"use server";
import { lazy, Suspense } from "react";
import { GetUserProfileAPI } from "@/api/userAPI/userAPI";
import { GetConfigurationSetingsAPI, GetClientUiSettingsAPI } from "@/api/utilsAPI";
import { GetPartnerStoreInfoAPI } from "@/api/partnerStoreAPI/partnerStoreAPI";
import AuthLayoutClientProvider from "@/providers/authLayoutClientProvider";
import { cookies, headers } from "next/headers";

import SWRConfigProvider from "@/providers/swrConfigProvider";
import { UserProfileInterface } from "@/interface/user";

export default async function AuthLayoutServerProvider({ children }: { children: React.ReactNode }) {
    const token = cookies().get("accessToken")?.value;
    console.log("have token =>", token);

    const headersList = headers();
    const url = headersList.get("referer") || headersList.get("host");

    // 在 headers 中手动解析 URL 并获取 pathname
    const pathname = url ? new URL(url).pathname : "";

    console.log("server layout pathname =>", pathname);

    async function getUserProfile() {
        if (token) {
            try {
                const data = await GetUserProfileAPI(token);
                return data;
            } catch (err) {
                console.log("DefaultLayoutServerPage GetUserProfileAPI err =>", err);
            }
        }
        return null;
    }
    const user: UserProfileInterface | null = await getUserProfile();

    /**
     * 取得顯示設定或是其他設定值
     * @returns
     */
    async function getConfigurationSettings() {
        try {
            const data = await GetConfigurationSetingsAPI();
            return data.configurations;
        } catch (err) {
            console.log("GetUiOrConfigurationSetingsAPI =>", err);
        }
    }
    // 顯示設定或其他設定資料
    const configurationSettingsData = await getConfigurationSettings();

    /**
     * 取得前台顯示設定
     */
    async function getClientUiSettings() {
        try {
            const data = await GetClientUiSettingsAPI();
            return data.data;
        } catch (err) {
            console.log("GetClientUiSettingsAPI =>", err);
        }
    }

    // async function getPartnerStoreInfo() {
    //     if (merchantCode) {
    //         try {
    //             const data = await GetPartnerStoreInfoAPI({ merchantCode, venueCode });
    //             console.log("getPartnerStoreInfoAPI Data =>", data);
    //         } catch (error) {
    //             console.log("merchantCode =>", merchantCode);
    //             console.error("getPartnerStoreInfoAPI error =>", error);
    //         }
    //     }
    // }
    // 前台顯示設定
    const clientUiSettings = await getClientUiSettings();
    // 重新整理 token 避免過期
    // const refreshToken = await import("@/service/actions-client").then((module) => module.refreshToken);

    // await refreshToken({ expiresTime: Number(cookies().get("expiresTime")?.value), token });
    return (
        <SWRConfigProvider>
            {pathname === "/zh-TW/rd" ? (
                <div>{children}</div>
            ) : (
                <AuthLayoutClientProvider
                    user={user}
                    configurationSettingsData={configurationSettingsData}
                    clientUiSettings={clientUiSettings}
                >
                    {children}
                </AuthLayoutClientProvider>
            )}
        </SWRConfigProvider>
    );
}
