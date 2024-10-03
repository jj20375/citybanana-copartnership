"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import RightNowActivityOrderListItem from "./components/RightNowActivityOrderListItem";
import type { RightNowActivityOrderListItemInterface } from "./rightnowactivity-order-list-interface";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "../rightnowactivity-recruitment-order/rightnowactivity-order-interface";
import { tmc } from "@/service/utils";

export default function OrderListView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");

    // 訂單狀態選項
    const statusTabs = ["all", "starting", "waiting"];
    const [currentTab, setCurrentTab] = useState("all");

    const onChangeTab = (val: string) => {
        setCurrentTab(val);
    };

    const [orderList, setOrderList] = useState<
        {
            providerData: RightNowActivityOrderDetailProviderSigupCardInterface;
            orderData: RightNowActivityOrderListItemInterface;
        }[]
    >();

    useEffect(() => {
        const apiDatas: {
            providerData: RightNowActivityOrderDetailProviderSigupCardInterface;
            orderData: RightNowActivityOrderListItemInterface;
        }[] = Array.from({ length: 10 }).map((_, i) => ({
            providerData: {
                id: `provider-${i}`,
                name: "test1-" + i,
                cover: `https://picsum.photos/id/${i + 10}/300/300`,
                rate: 4.5,
                description:
                    "Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还通过了电子排版的挑战，其雏形却依然保存至今。在1960年代，”Leatraset”公司发布了印刷着Lorem Ipsum段落的纸张，从而广泛普及了它的使用。最近，计算机桌面出版软件”Aldus PageMaker”也通过同样的方式使Lorem Ipsum落入大众的视野。",
                unit: "hour",
                height: 160,
                weight: 70,
                age: 35,
                travelTime: 35,
                isNowTime: true,
                price: 2000,
                area: "TW-TPE",
                job: "金融業",
                authentication: true,
                isQueen: true,
                enrollerStatus: 0,
            },
            orderData: {
                id: "orderidabc-" + i,
                name: "test活動name" + `-${i}`,
                time: "2024/10/02 13:00 - 20:00",
                location: "台北101",
                total: 4000,
            },
        }));
        setOrderList(apiDatas);
    }, []);

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
                {Array.isArray(orderList) &&
                    orderList.map((item) => (
                        <RightNowActivityOrderListItem
                            key={item.orderData.id}
                            providerData={item.providerData}
                            orderData={item.orderData}
                            lng={lng}
                            customClass="mt-[20px]"
                        />
                    ))}
            </ul>
        </div>
    );
}
