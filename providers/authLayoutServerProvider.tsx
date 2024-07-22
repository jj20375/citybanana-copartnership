"use server";
import { lazy, Suspense } from "react";
import { GetUserProfileAPI } from "@/api/userAPI";
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
    await refreshToken({ expiresTime: Number(cookies().get("expiresTime")?.value), token });
    return (
        <SWRConfigProvider>
            <AuthLayoutClientProvider user={user}>{children}</AuthLayoutClientProvider>
        </SWRConfigProvider>
    );
}
