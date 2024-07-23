"use server";
import { lazy, Suspense } from "react";
import { GetUserProfileAPI } from "@/api/userAPI";
import { GetConfigurationSetingsAPI } from "@/api/utilsAPI";
import AuthLayoutClientProvider from "@/providers/authLayoutClientProvider";
import { cookies } from "next/headers";

import SWRConfigProvider from "@/providers/swrConfigProvider";
import { refreshToken } from "@/service/actions";

export default async function AuthLayoutServerProvider({ children }: { children: React.ReactNode }) {
    const token = cookies().get("accessToken")?.value;

    async function getUserProfile() {
        if (token) {
            try {
                const data = await GetUserProfileAPI(token);
                return data;
            } catch (err) {
                console.log("DefaultLayoutServerPage GetUserProfileAPI err =>", err);
            }
        }
    }
    const user = await getUserProfile();

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
    await refreshToken({ expiresTime: Number(cookies().get("expiresTime")?.value), token });
    return (
        <SWRConfigProvider>
            <AuthLayoutClientProvider
                user={user}
                configurationSettingsData={configurationSettingsData}
            >
                {children}
            </AuthLayoutClientProvider>
        </SWRConfigProvider>
    );
}
