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
// 新增服務商數量彈窗
import RightNowActivityOrderChangeRequiredProviderCountModal from "./components/RightNowActivityOrderChangeRequiredProviderCountModal";
// 服務商報名區塊
import RightNowActivityOrderProviderSignUp from "./components/RightNowActivityOrderProviderSignup";
// 取消活動彈窗
import RightNowActivityOrderCancelModal from "./components/RightNowActivityOrderCancelModal";
import ContactWe from "../components/ContactWe";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RightNowActivityOrderDetailProviderSigupCard } from "./rightnowactivity-order-interface";

export default function RightNowActivityOrderDetailView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");

    const title = t("rightNowActivityOrderDetail.title");

    // 新增服務商人數彈窗 dom
    const changeRequiredProviderCountRef = useRef<any>();

    // 開啟修改服務商人數彈窗
    const openChangeRequiredProviderCountModal = () => {
        changeRequiredProviderCountRef.current.openModal();
    };

    // 取消活動彈窗 dom
    const cancelOrderModalRef = useRef<any>();

    // 開啟取消活動彈窗
    const openCancelOrderModal = () => {
        cancelOrderModalRef.current.openModal();
    };

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

    const [providers, setProviders] = useState<RightNowActivityOrderDetailProviderSigupCard[]>([]);
    const [chooseValues, setChooseValues] = useState([]);

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
        const providers: any = [];

        for (let i = 0; i < 10; i++) {
            providers.push({
                id: `provider-${i}`,
                name: "test1",
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
            });
        }
        setProviders(providers);
    }, []);
    useEffect(() => {
        if (providers.length > 0) {
            setRecruitmentContent(
                <RightNowActivityOrderProviderSignUp
                    lng={lng}
                    providers={providers}
                    isSigleChoose={false}
                    parentValues={chooseValues}
                    setParentValues={setChooseValues}
                />
            );
        }
    }, [providers]);

    return (
        <>
            <TitleCompoent title={title} />
            <div className="mx-auto max-w-[400px] mt-[40px]">
                <RightNowActivityOrderTopContent
                    lng={lng}
                    values={orderTopContent?.datas}
                    customClass="border-b border-gray-light pb-[30px]"
                />
                {JSON.stringify(chooseValues)}
                <RightNowActivityOrderRecruitment
                    lng={lng}
                    customClass="mt-[30px] border-b border-gray-light pb-[30px]"
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
                    <button
                        onClick={openChangeRequiredProviderCountModal}
                        type="button"
                        className="text-primary border border-primary rounded-md h-[45px] flex items-center justify-center"
                    >
                        {t("rightNowActivityOrderDetail.button-addRequiredProviderCount")}
                    </button>
                    <button
                        onClick={openCancelOrderModal}
                        type="button"
                        className="mt-[15px] text-gray-third border border-gray-third rounded-md h-[45px] flex items-center justify-center"
                    >
                        {t("global.cancel-activity")}
                    </button>
                </div>
                <ContactWe lng={lng} />
                <div className="h-[123px] w-full"></div>
            </div>
            <RightNowActivityOrderChangeRequiredProviderCountModal
                lng={lng}
                orderId="123"
                currentProviderCount={2}
                ref={changeRequiredProviderCountRef}
            />
            <RightNowActivityOrderCancelModal
                lng={lng}
                orderId="123"
                description={t("rightNowActivityOrderDetail.cancel.description")}
                needConfirm={true}
                confirmText={t("rightNowActivityOrderDetail.cancel.label-checkbox")}
                confirmTextDescription={t("rightNowActivityOrderDetail.cancel.label-checkbox-description", { hour: 24, price: 20 })}
                ref={cancelOrderModalRef}
            />
        </>
    );
}
