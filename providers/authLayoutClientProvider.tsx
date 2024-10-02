"use client";

import { useAppDispatch } from "@/store-toolkit/storeToolkit";
import { UserProfileInterface } from "@/interface/user";
import useUserStore from "@/store-zustand/userStore";
import { setUserProfile, fetchGetFirebaseCustomToken, fetchFirebaseLogin } from "@/store-toolkit/stores/userStore";
import { setRightNowActivityConfiguration } from "@/store-toolkit/stores/orderStore";
import { setClientUiSettings, setErrorMessageLang } from "@/store-toolkit/stores/utilityStore";
import { useCallback, useEffect, useState } from "react";
import { refreshToken, refreshFirebaseToken } from "@/service/actions";
import { isOnAuthStateChange } from "@/lib/firebase/firebase-hooks";
import WindowResizeContext from "@/context/windowResizeContext";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { getPartnerStoreInfo } from "@/store-toolkit/stores/partnerStore";
import { firebaseConnectRef } from "@/lib/firebase/firebase-hooks";

function IntervalCount() {
    let [count, setCount] = useState(0);
    useEffect(() => {
        let id = setInterval(async () => {
            setCount((count) => count + 10);
            console.log("count =>", count);
            if (getCookie("accessToken")) {
                await refreshToken({ expiresTime: getCookie("expiresTime") ? Number(getCookie("expiresTime")) : null, token: getCookie("accessToken") });
            }
            if (getCookie("accessToken")) {
                await refreshFirebaseToken({ expiresTime: 60 * 60, token: getCookie("accessToken") });
            }
        }, 1000 * 60 * 5);
        return () => clearInterval(id);
    }, [count]);
    return null;
}

export default function DefaultLayoutClient({ user, configurationSettingsData, clientUiSettings, children }: { user: UserProfileInterface; configurationSettingsData: any; clientUiSettings: any; children: React.ReactNode }) {
    console.log("rerender client layout");
    const dispatch = useAppDispatch();
    const setUser = useUserStore((state) => state.setUser);

    if (user !== undefined) {
        setUser(user);
        dispatch(setUserProfile(user));
    }
    dispatch(setRightNowActivityConfiguration(configurationSettingsData));
    dispatch(setClientUiSettings(clientUiSettings));

    const getErrorMessageLang = useCallback(async () => {
        try {
            const data = await firebaseConnectRef("langs/errorStatus").get();
            // 判斷是否有訊息
            if (data.exists()) {
                dispatch(setErrorMessageLang(data.val()));
                return data.val();
            }
            return null;
        } catch (err) {
            console.log("getErrorMessageLang =>", err);
            throw err;
        }
    }, []);

    useEffect(() => {
        // 判斷有 token 在執行 取得 firebase token
        if (getCookie("accessToken")) {
            dispatch(fetchGetFirebaseCustomToken()).then((res: any) => {
                dispatch(fetchFirebaseLogin(res.payload.token));
                isOnAuthStateChange();
            });
        }
        // 判斷有店家代碼時 取得店家資料
        if (getCookie("merchantCode")) {
            dispatch(getPartnerStoreInfo({ merchantCode: getCookie("merchantCode")!, venueCode: getCookie("venueCode")! }));
        }

        // 取得錯誤語系檔
        getErrorMessageLang();
    }, []);
    return (
        <>
            <WindowResizeContext>
                <section>{children}</section>
            </WindowResizeContext>
            {/* <IntervalCount /> */}
        </>
    );
}
