"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "@/views/template1/rightnowactivity-order/rightnowactivity-order-interface";
// 服務商資料區塊 ui
import OrderByProviderContent from "@/views/template1/order/components/OrderByProviderContent";
// 訂單資料區塊
import RightNowActivityOrderTopContent from "../rightnowactivity-order/components/RightNowActivityOrderTopContent";
import { tmc } from "@/service/utils";

/**
 * 訂單詳細資料
 * @param param0
 * @returns
 */
export default function OrderDetail({ lng, providerData, renderTitle }: { lng: string; providerData: RightNowActivityOrderDetailProviderSigupCardInterface; renderTitle: React.ReactElement }) {
    type DisplayOrder = {
        datas: {
            label: string;
            value: string;
            column: string;
        }[];
    };
    const { t } = useTranslation(lng, "main");

    // 訂單資料
    const [orderContent, setOrderContent] = useState<DisplayOrder>();
    // 訂單付款資料
    const [orderPaymentContent, setOrderPaymentContent] = useState<DisplayOrder>();

    // 訂單細節資料顯示 key
    const displayOrderContentKeys = ["column-store", "column-startDate", "column-note"];
    // 訂單細節付款資料顯示 key
    const displayOrderPaymentKeys = ["column-requiredProviderCount", "column-price", "column-duration", "column-paymentMethod"];
    useEffect(() => {
        const apiDatas: DisplayOrder = {
            datas: [
                { label: t("rightNowActivityOrderDetail.column-store"), value: "測試商家", column: "column-store" },
                { label: t("rightNowActivityOrderDetail.column-startDate"), value: "服務商到場時間", column: "column-startDate" },
                { label: t("rightNowActivityOrderDetail.column-note"), value: "測試活動備註", column: "column-note" },
                { label: t("rightNowActivityOrderDetail.column-requiredProviderCount"), value: t("rightNowActivityOrderDetail.value-requiredProviderCount", { val: 1 }), column: "column-requiredProviderCount" },
                { label: t("rightNowActivityOrderDetail.column-price"), value: t("rightNowActivityOrder.price", { val: 0, customPriceByDetailHourPrice: 0 }), column: "column-price" },
                { label: t("rightNowActivityOrderDetail.column-duration"), value: t("rightNowActivityOrderDetail.value-duration", { val: 3 }), column: "column-duration" },
                { label: t("rightNowActivityOrderDetail.column-paymentMethod"), value: t("rightNowActivityOrderDetail.value-paymentMethod-creditCard"), column: "column-paymentMethod" },
            ],
        };
        setOrderContent({ datas: apiDatas.datas.filter((data) => displayOrderContentKeys.includes(data.column)) });
        setOrderPaymentContent({
            datas: apiDatas.datas.filter((data) => displayOrderPaymentKeys.includes(data.column)),
        });
    }, []);
    return (
        <>
            {renderTitle}
            <OrderByProviderContent
                lng={lng}
                providerData={providerData}
            />
            <RightNowActivityOrderTopContent
                lng={lng}
                values={orderContent?.datas}
                showButton={false}
                customClass={tmc("border-t py-[30px] border-gray-light mt-[30px]")}
            />
        </>
    );
}
