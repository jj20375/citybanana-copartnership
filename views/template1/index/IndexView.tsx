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
        <section className="bg-black h-screen md:static fixed w-full">
            <div className="text-white mx-auto md:max-w-[400px] w-full text-center bg-black">
                <div
                    className="w-full overflow-hidden md:max-h-[800px] md:min-h-[800px] h-screen bg-end bg-cover"
                    style={{ backgroundImage: "url(/img/index/storeBg.png)" }}
                >
                    {/* <Image
                        src="/img/index/storeBg.png"
                        width={400}
                        height={400}
                        alt="storeBg"
                        className="mx-auto md:w-[400px] w-full"
                    /> */}
                </div>
                <div className="z-50 md:w-[400px] w-full md:static fixed bottom-[calc(5%)]">
                    {/* <h1 className="text-lg-title">{t("index.title")}</h1> */}
                    {/* <h2 className="text-lg-title">{t("index.second-title")}</h2> */}
                    <button
                        onClick={onNextStepButtonClick}
                        disabled={!partnerStoreInfo.merchant}
                        className="DisabledGradient mx-auto rounded-md PrimaryGradient h-[45px] w-[271px] flex items-center justify-center mt-[40px] mb-[64px]"
                    >
                        {t("index.start")}
                    </button>
                </div>
            </div>
        </section>
    );
}
