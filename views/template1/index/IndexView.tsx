"use client";
import { useEffect, useCallback, useState } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { getPartnerStoreInfo } from "@/store-toolkit/stores/partnerStore";
export default function IndexView({ lng, merchantCode, venueCode }: { lng: string; merchantCode: string; venueCode?: void | string }) {
    const { t } = useTranslation(lng, "main");

    const dispatch = useAppDispatch();
    const partnerStoreInfo = useAppSelector((state) => state.partnerStore.partnerStoreInfo);

    useEffect(() => {
        dispatch(getPartnerStoreInfo({ merchantCode, venueCode }));
    }, []);

    return (
        <div className="text-white mx-auto max-w-[400px] text-center flex flex-col justify-end h-screen bg-gradient-to-t from-black to-white">
            <pre className="text-black my-10">{JSON.stringify(partnerStoreInfo, null, 4)}</pre>
            <h1 className="text-lg-title">{t("index.title")}</h1>
            <h2 className="text-lg-title">{t("index.second-title")}</h2>
            <Link
                href="/create-rightnowactivity-order"
                className="mx-auto"
            >
                <button className="rounded-md PrimaryGradient h-[45px] w-[271px] flex items-center justify-center mt-[40px] mb-[64px]">{t("index.start")}</button>
            </Link>
        </div>
    );
}
