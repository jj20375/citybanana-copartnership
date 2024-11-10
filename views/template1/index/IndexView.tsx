"use client";
import { useEffect, useCallback, useState } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { getPartnerStoreInfo, usePartnerStoreCodeSelector } from "@/store-toolkit/stores/partnerStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCookie } from "cookies-next";
export default function IndexView({ lng, merchantCode, venueCode }: { lng: string; merchantCode: string; venueCode?: void | string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    const dispatch = useAppDispatch();
    const partnerStoreInfo = useAppSelector((state) => state.partnerStore.partnerStoreInfo);

    const onNextStepButtonClick = () => {
        router.push("/create-rightnowactivity-order");
    };

    useEffect(() => {
        dispatch(getPartnerStoreInfo({ merchantCode, venueCode }));
    }, []);

    // 當沒有拿到 店家代碼 且 有存在 cookie 時 重新取得店家資料一次
    useEffect(() => {
        if (!partnerStoreInfo.merchant && getCookie("merchantCode")) {
            dispatch(getPartnerStoreInfo({ merchantCode, venueCode }));
        }
    }, [partnerStoreInfo]);

    return (
        <div className="text-white mx-auto md:max-w-[400px] w-full text-center flex flex-col justify-end md:static fixed">
            <div className="relative top-0 md:w-[400px] w-full z-10">
                <div className="bg-gradient-to-t from-black to-[hsla(0,12%,52%,0)] absolute z-[10] top-0 w-full h-[92vh]"></div>
                <div className="absolute z-[5] md:top-52 top-10 w-full overflow-hidden">
                    <Image
                        src="/img/index/storeBg.png"
                        width={400}
                        height={400}
                        alt="storeBg"
                        className="mx-auto md:w-[400px] w-full"
                    />
                </div>
                <div className="fixed md:bottom-52 bottom-5 z-20 md:w-[400px] w-full">
                    <h1 className="text-lg-title">{t("index.title")}</h1>
                    <h2 className="text-lg-title">{t("index.second-title")}</h2>
                    <button
                        onClick={onNextStepButtonClick}
                        disabled={!partnerStoreInfo.merchant}
                        className="DisabledGradient mx-auto rounded-md PrimaryGradient h-[45px] w-[271px] flex items-center justify-center mt-[40px] mb-[64px]"
                    >
                        {t("index.start")}
                    </button>
                </div>
            </div>
        </div>
    );
}
