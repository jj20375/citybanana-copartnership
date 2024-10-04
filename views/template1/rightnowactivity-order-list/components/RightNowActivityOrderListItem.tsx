"use client";
import { useState, useMemo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { OrderLisItemtInterface, RightNowActivityOrderListItemInterface } from "../rightnowactivity-order-list-interface";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "../../rightnowactivity-recruitment-order/rightnowactivity-order-interface";
import Image from "next/image";
import { tmc } from "@/service/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
/**
 * 即刻快閃招募中訂單列表
 * @param param0
 * @returns
 */

export function RightNowActivityOrderListItem({ lng, orderData, customClass }: { lng: string; orderData: RightNowActivityOrderListItemInterface | any; customClass?: string | void }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    const goToDetail = (id: string) => {
        router.push(`/rightnowactivity-order/${id}`);
        return;
    };

    const time = useMemo(() => {
        return `${orderData.startDay} ${orderData.startTime} ~ ${orderData.endDay} ${orderData.endTime}`;
    }, [orderData]);

    const OrderContent = (
        <ul className="flex items-center mt-[8px] flex-1 h-[80px]">
            <li className="flex items-center flex-col mr-[13px] h-full">
                <div className="  border w-[58px] h-[26px] text-[12px] flex items-center justify-center border-primary rounded text-primary">{t("rightNowActivityOrderList.status-pending")}</div>
                <h5 className="flex-grow flex items-center text-lg-title leading-none text-primary">{orderData.requiredProviderCount}</h5>
                <p className="flex-1 text-primary text-xs-content">{t("rightNowActivityOrderList.requiredProviderCount")}</p>
            </li>
            <li className="flex flex-col h-full">
                <h2 className="flex-grow text-sm-title font-bold leading-none line-clamp-1">{orderData.name}</h2>
                <p className="flex-1 text-[15px] leading-none">{time}</p>
                <p className="mt-2 text-[15px] leading-none line-clamp-1">{orderData.location}</p>
            </li>
        </ul>
    );

    return (
        <li className={tmc([customClass, "pb-[15px] border-b border-gray-light"])}>
            <div className="flex items-center">
                {OrderContent}
                <Icon
                    className="text-3xl cursor-pointer text-gray-third text-right"
                    icon="iconamoon:arrow-right-2-light"
                    onClick={() => goToDetail(orderData.id)}
                />
            </div>
        </li>
    );
}
/**
 * 待付約與進行中訂單列表
 * @param param0
 * @returns
 */
export function OrderListItem({ lng, providerData, orderData, customClass }: { lng: string; providerData: { name: string; cover: string; id: string }; orderData: OrderLisItemtInterface | any; customClass?: string | void }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    const goToDetail = (rightNowActivityID: string) => {
        router.push(`/order/${providerData.id}/${rightNowActivityID}`);
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

    const time = useMemo(() => {
        return `${orderData.startDay} ${orderData.startTime} ~ ${orderData.endDay} ${orderData.endTime}`;
    }, [orderData]);

    const displayOrder: { [key: string]: string } = {
        "column-name": orderData.name,
        "column-time": time,
        "column-location": orderData.location,
        "column-total": orderData.total,
    };

    const OrderContent = (
        <ul className="flex flex-col mt-[8px]">
            {typeof displayOrder === "object" &&
                Object.keys(displayOrder).map((key, index) => (
                    <li
                        key={key}
                        className={tmc([Object.keys(displayOrder).length - 1 === index ? "" : "mb-2", "flex relative"])}
                    >
                        <div className="text-[15px] text-gray-third mr-[13px] whitespace-nowrap">{t(`orderList.${key}`)}</div>
                        <div className={tmc([key === "column-name" || key === "column-total" ? "text-primary font-bold" : "text-gray-primary", "text-[15px]", key === "column-location" && "line-clamp-1"])}>
                            {key !== "column-total" ? displayOrder[key] : t("rightNowActivityOrder.price", { val: displayOrder[key] })}
                        </div>
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
                    className="text-3xl cursor-pointer text-gray-third text-right"
                    icon="iconamoon:arrow-right-2-light"
                    onClick={() => goToDetail(orderData.rightNowActivityID)}
                />
            </div>
        </li>
    );
}
