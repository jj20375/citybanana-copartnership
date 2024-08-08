"use client";

import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import Image from "next/image";
import styles from "../styles/RightNowActivityOrderRecruitmentLogoAnimation.module.scss";

const RightNowActivityOrderRecruitmentLogoAnimation = memo(({ lng, customClass }: { lng: string; customClass?: string | void }) => {
    const { t } = useTranslation(lng, "main");
    return (
        <div className={`${customClass} flex justify-center`}>
            <div>
                <div className="my-[15px] min-h-[160px] max-h-[160px] min-w-[160px] max-w-[160px] flex items-center justify-center relative top-0">
                    <Image
                        src="/img/logos/logo_type4.svg"
                        width={100}
                        height={100}
                        alt="logo"
                        className={`mx-auto spin absolute z-10 bg-white rounded-full ${styles.spin}`}
                        style={{ width: "100px", height: "auto" }}
                    />
                    <span className={`absolute inline-flex w-full h-full bg-red-200 rounded-full ${styles.ping}`}></span>
                    <span className={`absolute inline-flex w-full h-full bg-red-200 rounded-full ${styles.ping2}`}></span>
                    <span className={`absolute inline-flex w-full h-full bg-red-200 rounded-full ${styles.ping3}`}></span>
                </div>
                <h5 className="animate-pulse text-primary text-sm-title font-semibold text-center">{t("rightNowActivityOrderDetail.recruitment.waitProvider")}</h5>
            </div>
        </div>
    );
});

export default RightNowActivityOrderRecruitmentLogoAnimation;
