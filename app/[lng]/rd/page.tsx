"use server";
import Image from "next/image";
import CreateRightNowActivityOrderView from "@/views/template1/create-rightnowactivity-order/CreateRightNowActivityOrderView";
import { useTranslation } from "@/i18n";
import { GetSmsLinkByRightNowActivityOrderToGetUserTokenAPI, ServerGetSmsLinkByRightNowActivityOrderToGetUserTokenAPI } from "@/api/userAPI/userAPI";
import { setToken } from "@/service/actions";
import dayjs from "dayjs";
import { redirect } from "next/navigation";

export default async function Page({ params: { lng }, searchParams }: { params: { lng: string; id?: string | void }; searchParams: { t: string; k?: string | void } }) {
    const code = searchParams.k;
    const type = searchParams.t;

    if (code) {
        /**
         * 透過簡訊發送即刻快閃單連結時 取得使用者身份
         */
        const getSmsLinkByRightNowActivityOrderToGetUserToken = async (code: string) => {
            try {
                const res = await ServerGetSmsLinkByRightNowActivityOrderToGetUserTokenAPI(code);
                const id: string = res.demand_id;
                const expires = dayjs(res.expires_in).valueOf() ?? dayjs().add(30, "day").valueOf();
                if (res.jwt) {
                    try {
                        const baseUrl = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000"; // 根據你的環境來決定
                        const apiUrl = `${baseUrl}/api/auth/set-token`;

                        // 將 token 設定在伺服器端
                        const response = await fetch(apiUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ token: res.jwt, expiresTime: expires }),
                        });
                        if (response.ok) {
                            console.log("Token successfully set");
                        }
                    } catch (err) {
                        console.log("set token err =>", err);
                        throw err;
                    }
                }
                return {
                    error: false,
                    id,
                    token: res.jwt,
                    expiresTime: expires,
                };
            } catch (err: any) {
                console.log("GetSmsLinkByRightNowActivityOrderToGetUserTokenAPI err =>");
                console.log(JSON.stringify(err));

                return {
                    error: true,
                };
            }
        };
        const res = await getSmsLinkByRightNowActivityOrderToGetUserToken(code);
        if (res.id && type === "a" && !res.error) {
            return redirect(`/${lng}/rightnowactivity-order/${res.id}/?token=${res.token}&expiresTime=${res.expiresTime}`);
        } else {
            console.log("res err =>");
            redirect(`/${lng}/sms-order/error`);
        }
    }
    // function runClient() {
    //     "use client";
    //     const router = useRouter();
    //     useEffect(() => {
    //         const origin = window.location.origin;
    //         router.push(`${origin}/${lng}/rightnowactivity-order/${id!}`);
    //     }, []);
    // }

    return <div>work</div>;
}
