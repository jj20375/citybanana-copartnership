"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "../rightnowactivity-order-interface";
import Image from "next/image";

/**
 * 服務商報名即刻快閃活動 卡片 ui
 */
const RightNowActivityOrderSignUpCard = memo(({ lng, providerCardData, customClass }: { lng: string; providerCardData: RightNowActivityOrderDetailProviderSigupCardInterface; customClass?: string | void }) => {
    const { t } = useTranslation(lng, "main");
    const providerInit: string[] = [];

    if (providerCardData.weight) {
        providerInit.push(providerCardData.age + t("global.age"));
    }
    if (providerCardData.weight) {
        providerInit.push(providerCardData.weight + t("global.weight"));
    }
    if (providerCardData.height) {
        providerInit.push(providerCardData.height + t("global.height"));
    }
    return (
        <div className={`${customClass} border border-gray-light rounded-md`}>
            <div className="flex items-center">
                <div className="flex-1 relative">
                    <Image
                        className="rounded-tl-md rounded-bl-md object-cover w-full h-full"
                        src={providerCardData.cover}
                        width={300}
                        height={300}
                        alt="provider logo"
                    />
                    <div className="absolute bottom-0 PrimaryGradient rounded-bl-md w-full text-white h-[25px] flex items-center leading-none justify-center text-[11px]">
                        {t("global.price", { val: providerCardData.price }) + t("global.moneyUnit")} / {t("global.priceUnit.hour")}
                    </div>
                </div>
                <div className="flex-1 px-[10px]">
                    <div className="flex items-center mb-[8px]">
                        <h5 className="pr-5 text-lg-content font-bold text-gray-primary">{providerCardData.name}</h5>
                        {providerCardData.rate && (
                            <>
                                <span className="pr-[2.5px]">
                                    <Image
                                        src="/img/icons/rate.svg"
                                        width={10}
                                        height={10}
                                        alt="rate"
                                        style={{ width: "10px", height: "auto" }}
                                    />
                                </span>
                                <span className="text-[12px] text-gray-primary font-bold">{providerCardData.rate}</span>
                            </>
                        )}
                    </div>
                    <ul className="flex text-[8px]">
                        {providerInit.map((item, index) => (
                            <li
                                key={item}
                                className={`${index === providerInit.length - 1 ? "pl-2" : "border-r pr-2"} ${index % 2 !== 0 ? "pl-2" : ""} text-[#535353]`}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                    <p className="line-clamp-4 text-xs-content text-gray-primary mt-[7px]">{providerCardData.description}</p>
                    {providerCardData.isNowTime && (
                        <div className="flex text-xs-content font-bold mt-[7px]">
                            <p className="text-gray-primary flex-1">{t("rightNowActivityOrderRecruitmentDetail.recruitment.travelTime")}</p>
                            <p className="text-primary flex-1 text-right">
                                {providerCardData.travelTime}
                                {t("global.minute")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});
export default RightNowActivityOrderSignUpCard;
