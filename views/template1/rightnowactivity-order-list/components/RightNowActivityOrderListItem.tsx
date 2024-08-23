"use client";
import { useState } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { RightNowActivityOrderListItemInterface } from "../rightnowactivity-order-list-interface";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "../../rightnowactivity-recruitment-order/rightnowactivity-order-interface";
import Image from "next/image";
import { tmc } from "@/service/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
export default function RightNowActivityOrderListItem({ lng, providerData, orderData, customClass }: { lng: string; providerData: RightNowActivityOrderDetailProviderSigupCardInterface; orderData: RightNowActivityOrderListItemInterface | any; customClass?: string | void }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    const goToDetail = (id: string) => {
        router.push(`/rightnowactivity-order/${id}`);
        return;
    };

    const ProviderContent = (
        <div className="flex items-center">
            <Image
                src={providerData.cover}
                alt="provider avatar"
                width={100}
                height={100}
                style={{ width: "80px", height: "auto" }}
                className="rounded-md mr-[12px]"
            />
            <h5 className="text-gray-primary text-sm-title font-bold">{providerData.name}</h5>
        </div>
    );

    const OrderContent = (
        <ul className="flex flex-col mt-[8px]">
            {typeof orderData === "object" &&
                Object.keys(orderData)
                    .filter((key) => key !== "id")
                    .map((key, index) => (
                        <li
                            key={key}
                            className={tmc([Object.keys(orderData).length - 1 === index ? "" : "mb-2", "flex relative"])}
                        >
                            <div className="text-[15px] text-gray-third mr-[13px]">{t(`rightNowActivityOrderList.column-${key}`)}</div>
                            <div className={tmc([key === "name" || key === "total" ? "text-primary font-bold" : "text-gray-primary", "text-[15px]"])}>{orderData[key]}</div>
                        </li>
                    ))}
        </ul>
    );

    return (
        <li className={tmc([customClass, "pb-[15px] border-b border-gray-light"])}>
            {ProviderContent}
            <div className="flex items-center">
                {OrderContent}
                <Icon
                    className="text-3xl cursor-pointer text-black text-right flex-1"
                    icon="iconamoon:arrow-right-2-light"
                    onClick={() => goToDetail(orderData.id)}
                />
            </div>
        </li>
    );
}
