"use client";
import { useTranslation } from "@/i18n/i18n-client";
import TitleCompoent from "../components/TitleComponent";
// 上方訂單資料區塊
import RightNowActivityOrderTopContent from "./components/RightNowActivityOrderTopContent";
// 付款資訊區塊
import RightNowActivityOrderPaymentContent from "./components/RightNowActivityOrderPaymentContent";
// 招募區塊
import RightNowActivityOrderRecruitment from "./components/RightNowActivityOrderRecruitment";
// 招募區塊動畫
import RightNowActivityOrderLogoAnimation from "./components/RightNowActivityOrderLogoAnimation";
import ContactWe from "../components/ContactWe";
import { useEffect, useMemo, useState } from "react";

export default function RightNowActivityOrderDetailView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");

    const title = t("rightNowActivityOrderDetail.title");

    type DisplayOrder = {
        datas: {
            label: string;
            value: string;
            column: string;
        }[];
    };

    const [order, setOrder] = useState<any>({});
    const [displayOrder, setDisplayOrder] = useState<DisplayOrder>();
    const [orderTopContent, setOrderTopContent] = useState<DisplayOrder>();
    const [orderPaymentContent, setOrderPaymentContent] = useState<DisplayOrder>();
    // 訂單細節上方資料顯示 key
    const displayOrderTopKeys = ["column-store", "column-startDate", "column-note"];
    // 訂單細節付款資料顯示 key
    const displayOrderPaymentKeys = ["column-requiredProviderCount", "column-price", "column-duration", "column-paymentMethod"];

    // 判斷是否等待服務商報名中
    const [isWaitProviderApply, setIsWaitProviderApply] = useState(true);

    const [recruitmentContent, setRecruitmentContent] = useState(
        <RightNowActivityOrderLogoAnimation
            lng={lng}
            customClass="pb-[30px] border-b border-gray-light"
        />
    );

    const total = useMemo(() => {
        const price = order.price;
        const duration = order.duration;
        if (price === 0) {
            return t("rightNowActivityOrder.price", { val: price, customPriceByDetail: price });
        }
        return t("rightNowActivityOrder.price", { val: price * duration });
    }, [displayOrder]);

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
        console.log(
            "apiDatas.datas.filter((data) => displayOrderTopKeys.includes(data.column)) =>",
            apiDatas.datas.filter((data) => displayOrderTopKeys.includes(data.column))
        );
        setOrderTopContent({ datas: apiDatas.datas.filter((data) => displayOrderTopKeys.includes(data.column)) });
        setOrderPaymentContent({
            datas: apiDatas.datas.filter((data) => displayOrderPaymentKeys.includes(data.column)),
        });
        setDisplayOrder(apiDatas);
        setOrder({
            price: 0,
            duration: 2,
        });
    }, []);

    return (
        <>
            <TitleCompoent title={title} />
            <div className="mx-auto max-w-[400px] mt-[40px]">
                <RightNowActivityOrderTopContent
                    lng={lng}
                    values={orderTopContent?.datas}
                    customClass="border-b border-gray-light pb-[30px]"
                />
                <RightNowActivityOrderRecruitment
                    lng={lng}
                    customClass="mt-[30px]"
                    render={() => recruitmentContent}
                />
                <RightNowActivityOrderPaymentContent
                    lng={lng}
                    values={orderPaymentContent?.datas}
                    customClass="border-b border-gray-light py-[30px]"
                />
                <div className="flex mt-[30px] mb-[40px]">
                    <span className="text-gray-primary text-lg-content flex-1">{t("rightNowActivityOrderDetail.expectedPayment")}</span>
                    <span className="text-primary text-lg-content ">
                        {typeof total === "number" && total > 0 ? "NTD" : ""}
                        <span className="OpenSans font-medium">{total}</span>
                    </span>
                </div>
                <div className="flex flex-col">
                    <button className="text-primary border border-primary rounded-md h-[45px] flex items-center justify-center">增加活動需求人數</button>
                    <button className="mt-[15px] text-gray-third border border-gray-third rounded-md h-[45px] flex items-center justify-center">取消活動</button>
                </div>
                <ContactWe lng={lng} />
                <div className="h-[123px] w-full"></div>
            </div>
        </>
    );
}
