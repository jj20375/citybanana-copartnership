"use client";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { RightNowActivityOrderListItem, OrderListItem } from "./components/RightNowActivityOrderListItem";
import type { RightNowActivityOrderListItemInterface, OrderLisItemtInterface } from "./rightnowactivity-order-list-interface";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "../rightnowactivity-recruitment-order/rightnowactivity-order-interface";
import { tmc } from "@/service/utils";
import { GetRightNowActivityOrderListAPI } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI";
import dayjs from "dayjs";
import { GetOrderListAPI } from "@/api/orderAPI.ts/orderAPI";
import { rightNowActivityOrderStatusByMemberEnum } from "@/status-enum/order-enum";
import { useRouter } from "next/navigation";

export default function OrderListView({ lng, status }: { lng: string; status: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    // 訂單狀態選項
    const statusTabs = ["all", "starting", "waiting"];
    const [currentTab, setCurrentTab] = useState("all");

    const onChangeTab = (val: string) => {
        setCurrentTab(val);
        router.push(`/rightnowactivity-order/list/${val}`);
    };

    // 即刻快閃列表資訊
    const [rightNowActivityOrderList, setRightNowActivityOrderList] = useState<RightNowActivityOrderListItemInterface[]>();
    // 一般預訂單列表資訊
    const [orderList, setOrderList] = useState<OrderLisItemtInterface[]>();
    //

    /**
     * 取得即刻快閃列表
     */
    const getRightNowActivityOrderList = useCallback(async (params: any) => {
        try {
            const res = await GetRightNowActivityOrderListAPI(params);
            if (Array.isArray(res.data) && res.data.length > 0) {
                const list = res.data.map((item) => {
                    return {
                        id: item.demand_id,
                        name: item.name,
                        startDay: item.at_any_time ? t("rightNowActivityOrderPayment.startTime-now") : dayjs(item.started_at).format("YYYY-MM-DD"),
                        startTime: item.at_any_time ? "" : dayjs(item.started_at).format("HH:mm"),
                        endDay: item.at_any_time ? "" : dayjs(item.ended_at).format("YYYY-MM-DD"),
                        endTime: item.at_any_time ? "" : dayjs(item.ended_at).format("HH:mm"),
                        location: item.location,
                        total: item.details.total,
                        requiredProviderCount: item.provider_required,
                    };
                });
                setRightNowActivityOrderList(list);
            }
            console.log("GetRightNowActivityOrderListAPI res =>", res);
        } catch (err) {
            console.log("GetRightNowActivityOrderListAPI err => ", err);
            throw err;
        }
    }, []);

    const getOrderList = useCallback(async (params: any) => {
        try {
            const res = await GetOrderListAPI(params);
            if (Array.isArray(res.data) && res.data.length > 0) {
                const list = res.data.map((item) => {
                    return {
                        id: item.order_id,
                        rightNowActivityID: "",
                        name: item.description,
                        startDay: item.started_at === null ? t("rightNowActivityOrderPayment.startTime-now") : dayjs(item.started_at).format("YYYY-MM-DD"),
                        startTime: item.started_at === null ? "" : dayjs(item.started_at).format("HH:mm"),
                        endDay: item.started_at === null ? "" : dayjs(item.ended_at).format("YYYY-MM-DD"),
                        endTime: item.started_at === null ? "" : dayjs(item.ended_at).format("HH:mm"),
                        location: item.location,
                        total: item.details.total,
                        providerData: {
                            cover: item.provider!.thumbnails !== undefined && item.provider!.thumbnails.cover !== undefined ? item.provider!.thumbnails.cover["360x360"] : item.provider!.cover!,
                            name: item.provider.name,
                            id: item.provider.banana_id,
                        },
                    };
                });
                setOrderList(list);
            }
            console.log("GetOrderList API =>", res);
        } catch (err) {
            console.log("GetOrderListAPI err => ", err);
            throw err;
        }
    }, []);

    useEffect(() => {
        // 取得報名中即刻快閃單列表
        if (status === "all") {
            getRightNowActivityOrderList({ status: ["0"], limit: 100 });
        }
        // 取得進行中一般訂單列表
        if (status === "starting") {
            getOrderList({ status: [rightNowActivityOrderStatusByMemberEnum.InProgress], limit: 100 });
        }
        // 取得待赴約一般訂單列表
        if (status === "waiting") {
            getOrderList({ status: [rightNowActivityOrderStatusByMemberEnum.Confirmed], limit: 100 });
        }
        setCurrentTab(status);
    }, [status]);

    return (
        <div className="mx-auto max-w-[400px] mt-[40px]">
            <h1 className="mb-[10px] text-md-title font-bold text-center">{t("rightNowActivityOrderList.title")}</h1>
            <ul className="flex justify-between border-b border-gray-light">
                {statusTabs.map((tab) => (
                    <li
                        key={tab}
                        onClick={() => onChangeTab(tab)}
                        className={tmc([currentTab === tab ? "border-b-4 border-primary text-gray-primary" : "text-gray-third", "font-semibold text-[15px] cursor-pointer pb-[19px]"])}
                    >
                        {t(`rightNowActivityOrderList.status-${tab}`)}
                    </li>
                ))}
            </ul>
            <ul>
                {Array.isArray(rightNowActivityOrderList) && status === "all"
                    ? rightNowActivityOrderList.map((item) => (
                          <RightNowActivityOrderListItem
                              key={item.id}
                              orderData={item}
                              lng={lng}
                              customClass="my-[10px]"
                          />
                      ))
                    : null}
                {Array.isArray(orderList) && status !== "all"
                    ? orderList.map((item) => (
                          <OrderListItem
                              key={item.id}
                              providerData={item.providerData}
                              orderData={item}
                              lng={lng}
                              customClass="my-[10px]"
                          />
                      ))
                    : null}
            </ul>
        </div>
    );
}
