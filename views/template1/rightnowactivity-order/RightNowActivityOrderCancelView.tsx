"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import RightNowActivityOrderDetail from "../components/RightNowActivityOrderDetail";
import { Icon } from "@iconify/react";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "@/views/template1/rightnowactivity-recruitment-order/rightnowactivity-order-interface";
// 聯絡我們 ui
import ContactWe from "../components/ContactWe";
import Image from "next/image";
import ButtonBorderGradient from "../components/ButtonBorderGradient";

/**
 * 訂單詳細資料
 * @param param0
 * @returns
 */
export default function OrderDetailView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    type DisplayOrder = {
        datas: {
            label: string;
            value: string;
            column: string;
        }[];
    };

    const [seconds, setSeconds] = useState(5);
    const [isCounting, setIsCounting] = useState(false);
    const timerRef = useRef<any>(null);

    const [provider, setProvider] = useState<RightNowActivityOrderDetailProviderSigupCardInterface>({
        id: `provider-${0}`,
        name: "test1-" + "0",
        cover: `https://picsum.photos/id/11/300/300`,
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
    });

    const [order, setOrder] = useState<any>({});

    // 重新下訂按鈕事件
    const handleReCreate = () => {
        return router.push("/create-rightnowactivity-order");
    };

    // 不小按錯按鈕事件
    const onSubmit = () => {};

    const RenderTitle = () => (
        <div className=" mb-[40px] font-bold">
            <Image
                src="/img/icons/order-cancel.svg"
                alt="order create success"
                width={100}
                height={100}
                style={{ width: "50px", height: "auto" }}
                className="mx-auto"
            />
            <h1 className="text-black w-full text-md-title text-center mt-[30px]">{t("rightNowActivityOrderDetail.title-cancel")}</h1>
        </div>
    );

    const RenderButton = () => (
        <div className="flex flex-col">
            <ButtonBorderGradient
                onClick={onSubmit}
                buttonText={t("rightNowActivityOrderCancel.button-uncareful") + ` (${seconds})`}
                outsideClassName={`PrimaryGradient p-px rounded-md flex-1 DisabledGradient`}
                insideClassName={`PrimaryGradient rounded-[calc(0.5rem-3px)] p-2  w-full flex items-center text-white  bg-white justify-center h-[45px]`}
                isDisabled={false}
                buttonType="submit"
            />
            <button
                type="button"
                className="w-full mt-[15px] text-primary border rounded-md h-[45px] border-primary mr-[13px]"
                onClick={handleReCreate}
            >
                {t("rightNowActivityOrderCancel.button-recreate")}
            </button>
        </div>
    );

    const apiDatas: DisplayOrder = {
        datas: [
            { label: t("rightNowActivityOrderRecruitmentDetail.column-store"), value: "測試商家", column: "column-store" },
            { label: t("rightNowActivityOrderRecruitmentDetail.column-startDate"), value: "服務商到場時間", column: "column-startDate" },
            { label: t("rightNowActivityOrderRecruitmentDetail.column-note"), value: "測試活動備註", column: "column-note" },
            { label: t("rightNowActivityOrderRecruitmentDetail.column-requiredProviderCount"), value: t("rightNowActivityOrderRecruitmentDetail.value-requiredProviderCount", { val: 1 }), column: "column-requiredProviderCount" },
            { label: t("rightNowActivityOrderRecruitmentDetail.column-price"), value: t("rightNowActivityOrder.price", { val: 0, customPriceByDetailHourPrice: 0 }), column: "column-price" },
            { label: t("rightNowActivityOrderRecruitmentDetail.column-duration"), value: t("rightNowActivityOrderRecruitmentDetail.value-duration", { val: 3 }), column: "column-duration" },
            { label: t("rightNowActivityOrderRecruitmentDetail.column-paymentMethod"), value: t("rightNowActivityOrderRecruitmentDetail.value-paymentMethod-creditCard"), column: "column-paymentMethod" },
        ],
    };

    useEffect(() => {
        setProvider({
            id: `provider-${0}`,
            name: "test1-" + "0",
            cover: `https://picsum.photos/id/11/300/300`,
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
        });
        setOrder({
            price: 2000,
            duration: 2,
        });
        setIsCounting(true);
    }, []);

    useEffect(() => {
        if (isCounting) {
            timerRef.current = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds <= 1) {
                        clearInterval(timerRef.current);
                        setIsCounting(false);
                        return 0;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isCounting]);
    return (
        <div className="mx-auto max-w-[400px] mt-[40px]">
            <RightNowActivityOrderDetail
                lng={lng}
                renderTitle={RenderTitle()}
                renderButton={RenderButton()}
                providerData={provider}
                displayOrder={apiDatas}
                orderData={order}
            />
            <ContactWe lng={lng} />
        </div>
    );
}
