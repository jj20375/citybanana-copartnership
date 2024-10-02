"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "@/views/template1/rightnowactivity-recruitment-order/rightnowactivity-order-interface";
// 服務商資料區塊 ui
import RightNowActivityOrderByProviderContent from "@/views/template1/rightnowactivity-order/components/RightNowActivityOrderByProviderContent";
// 訂單資料區塊
import RightNowActivityOrderTopContent from "../rightnowactivity-recruitment-order/components/RightNowActivityOrderTopContent";
// 付款資料區塊
import RightNowActivityOrderPaymentContent from "../rightnowactivity-recruitment-order/components/RightNowActivityOrderPaymentContent";
// 總計區塊
import RightNowActivityOrderTotal from "../rightnowactivity-recruitment-order/components/RightNowActivityOrderTotal";
import { tmc } from "@/service/utils";

type DisplayOrder = {
    datas: {
        label: string;
        value: string;
        column: string;
    }[];
};
/**
 * 即刻快閃訂單詳細資料
 * @param param0
 * @returns
 */
export default function RightNowActivityOrderDetail({
    lng,
    providers,
    orderData,
    displayOrder,
    renderTitle,
    renderButton,
}: {
    lng: string;
    providers: RightNowActivityOrderDetailProviderSigupCardInterface[];
    orderData: any;
    displayOrder: DisplayOrder;
    renderTitle: React.ReactElement;
    renderButton: React.ReactElement;
}) {
    const { t } = useTranslation(lng, "main");

    // 訂單資料
    const [orderContent, setOrderContent] = useState<DisplayOrder>();
    // 訂單付款資料
    const [orderPaymentContent, setOrderPaymentContent] = useState<DisplayOrder>();

    // 訂單細節資料顯示 key
    const displayOrderContentKeys = ["column-store", "column-startDate", "column-note"];
    // 訂單細節付款資料顯示 key
    const displayOrderPaymentKeys = ["column-requiredProviderCount", "column-price", "column-duration", "column-paymentMethod"];

    const total = useMemo(() => {
        const price = orderData.hourly_pay;
        const duration = orderData.duration;
        if (price === 0) {
            return t("rightNowActivityOrder.price", { val: price, customPriceByDetail: price });
        }
        return t("rightNowActivityOrder.price", { val: price * duration });
    }, [orderData]);

    useEffect(() => {
        setOrderContent({ datas: displayOrder.datas.filter((data) => displayOrderContentKeys.includes(data.column)) });
        setOrderPaymentContent({
            datas: displayOrder.datas.filter((data) => displayOrderPaymentKeys.includes(data.column)),
        });
    }, []);
    return (
        <>
            {renderTitle}
            {Array.isArray(providers)
                ? providers.map((providerData) => (
                      <RightNowActivityOrderByProviderContent
                          key={providerData.id}
                          lng={lng}
                          providerData={providerData}
                      />
                  ))
                : null}
            <RightNowActivityOrderTopContent
                lng={lng}
                values={orderContent?.datas}
                showButton={false}
                customClass={tmc("border-t pt-[30px] border-gray-light mt-[30px]")}
            />
            <RightNowActivityOrderPaymentContent
                lng={lng}
                values={orderPaymentContent?.datas}
                customClass={tmc("border-y py-[30px] border-gray-light mt-[30px]")}
            />
            <RightNowActivityOrderTotal
                lng={lng}
                total={total}
                price={orderData.price}
            />
            {renderButton}
        </>
    );
}
