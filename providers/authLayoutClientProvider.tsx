"use client";

import { useAppDispatch } from "@/store-toolkit/storeToolkit";
import { UserProfileInterface } from "@/interface/user";
import useUserStore from "@/store-zustand/userStore";
import { setUserProfile, fetchGetFirebaseCustomToken, fetchFirebaseLogin } from "@/store-toolkit/stores/userStore";
import { useEffect, useState } from "react";
import { refreshToken, refreshFirebaseToken } from "@/service/actions";
import { getCookie } from "cookies-next";
import { isOnAuthStateChange } from "@/lib/firebase/firebase-hooks";
import WindowResizeContext from "@/context/windowResizeContext";

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

export default function DefaultLayoutClient({ user, children }: { user: UserProfileInterface; children: React.ReactNode }) {
    console.log("rerender client layout");
    const dispatch = useAppDispatch();
    const setUser = useUserStore((state) => state.setUser);
    setUser(user);
    dispatch(setUserProfile(user));
    // 判斷有 token 在執行 取得 firebase token

    if (getCookie("accessToken")) {
        dispatch(fetchGetFirebaseCustomToken()).then((res: any) => {
            dispatch(fetchFirebaseLogin(res.payload.token));
            isOnAuthStateChange();
        });
    }
    return (
        <>
            <WindowResizeContext>
                <section>{children}</section>
            </WindowResizeContext>
            {/* <IntervalCount /> */}
        </>
    );
}
