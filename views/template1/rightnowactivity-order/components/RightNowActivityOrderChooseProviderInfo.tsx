"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { RightNowActivityOrderDetailProviderSigupCard } from "../rightnowactivity-order-interface";
import Image from "next/image";
import { areasTW } from "@/config/area-tw.config";
import { Rate } from "antd";

/**
 * 選擇服務商幻燈片服務商個人介紹資料 ui
 */
const RightNowActivityOrderChooseProviderInfo = memo(({ lng, providerData }: { lng: string; providerData: RightNowActivityOrderDetailProviderSigupCard }) => {
    const { t } = useTranslation(lng, "main");
    const providerInit: string[] = [];

    if (providerData.area) {
        if (areasTW[providerData.area]) {
            providerInit.push(areasTW[providerData.area].name);
        }
    }
    if (providerData.weight) {
        providerInit.push(providerData.age + t("global.age"));
    }
    if (providerData.weight) {
        providerInit.push(providerData.weight + t("global.weight"));
    }
    if (providerData.height) {
        providerInit.push(providerData.height + t("global.height"));
    }

    function ProviderLevel() {
        return (
            <ul className="text-[14px] flex items-center mt-[12px]">
                <li className="flex items-center mr-5">
                    <Image
                        src="/img/icons/rate.svg"
                        alt="rate"
                        width={15}
                        height={15}
                        className="mr-2"
                        style={{ width: "15px", height: "auto" }}
                    />
                    <span className="text-gray-primary leading-none">{providerData.rate}</span>
                </li>
                {providerData.authentication && (
                    <li className="flex items-center mr-5">
                        <Image
                            src="/img/icons/authentication-checked.svg"
                            alt="authentication-checked"
                            width={15}
                            height={15}
                            className="mr-2"
                            style={{ width: "15px", height: "auto" }}
                        />
                        <span className="text-primary">{t("auth.authentication-checked")}</span>
                    </li>
                )}
                {typeof providerData.job === "string" && (
                    <li className="flex items-center">
                        <Image
                            src="/img/icons/job.svg"
                            alt="job"
                            width={15}
                            height={15}
                            className="mr-2"
                            style={{ width: "15px", height: "auto" }}
                        />
                        <span className="text-primary">{providerData.job}</span>
                    </li>
                )}
            </ul>
        );
    }

    return (
        <div className="mt-[18px]">
            <div className="flex items-center">
                <h2 className="text-left text-[20px]">
                    {providerData.name}
                    {providerData.id}
                </h2>
                <Image
                    src="/img/icons/message.svg"
                    width={10}
                    height={10}
                    alt="message"
                    className="ml-5"
                    style={{ width: "25px", height: "auto" }}
                />
            </div>
            <ul className="flex text-[14px] mt-[16px]">
                {providerInit.map((item, index) => (
                    <li
                        key={item}
                        className={`${index === providerInit.length - 1 ? "pl-2" : "border-r pr-2"} ${index % 2 !== 0 || index % 3 !== 0 ? "pl-2" : ""} } text-[#535353]`}
                    >
                        {item}
                    </li>
                ))}
            </ul>
            <ProviderLevel />
            <section className="text-left pt-[15px] mt-[15px] border-t border-gray-light">
                <h5 className="text-sm-content text-gray-third mb-[5px]">{t("provider.us")}</h5>
                <p className="text-[14px] text-gray-primary">{providerData.description}</p>
            </section>
            <section className="border-t border-gray-light mt-[15px] pt-[15px] text-left">
                <div className="mb-[16px] flex items-center">
                    <h5 className="text-gray-third text-sm-content">{t("comment.title")}</h5>
                    <Rate
                        allowHalf
                        className="ml-2"
                        defaultValue={providerData.rate}
                    />
                    <p className="ml-2 text-[12px] text-gray-primary">{providerData.rate}</p>
                </div>
            </section>
            <section className="flex">
                <div className="text-gray-primary text-[11px] mr-2">
                    {t("provider.responseRate")}：<span className="text-primary">高</span>
                </div>
                <div className="text-gray-primary text-[11px] mr-2">
                    {t("provider.temporaryCancellation")}：<span className="text-primary">10</span>
                    <span className="text-primary">{t("global.count")}</span>
                </div>
                <div className="text-gray-primary text-[11px]">
                    {t("provider.responseTime")}：<span className="text-primary">幾小時內</span>
                </div>
            </section>
            <button
                type="submit"
                className="text-white h-[45px] text-lg-content rounded-md PrimaryGradient block w-full mt-[25px]"
            >
                {t("global.choose")}
            </button>
        </div>
    );
});

export default RightNowActivityOrderChooseProviderInfo;
