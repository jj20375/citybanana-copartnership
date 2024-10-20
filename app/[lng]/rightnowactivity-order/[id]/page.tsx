"use client";
import Image from "next/image";
import RightNowActivityOrderDetailView from "@/views/template1/rightnowactivity-order/RightNowActivityOrderDetailView";
import { useTranslation } from "@/i18n";
import { GetSmsLinkByRightNowActivityOrderToGetUserTokenAPI } from "@/api/userAPI/userAPI";
import dayjs from "dayjs";
import { setClientToken } from "@/service/actions-client";
export default async function Page({ params: { lng, id }, searchParams: { token, expiresTime } }: { params: { lng: string; id?: string | void }; searchParams: { token?: string | void; expiresTime?: string | void } }) {
    console.log("rightNowActivityOrderDetailView token =>", token);
    if (token && expiresTime) {
        setClientToken({ token, expiresTime: Number(expiresTime) });
    }
    return (
        <>
            {id !== "null" && id ? (
                <RightNowActivityOrderDetailView
                    lng={lng}
                    orderID={id}
                />
            ) : (
                <div>沒有訂單編號</div>
            )}
        </>
    );
}
