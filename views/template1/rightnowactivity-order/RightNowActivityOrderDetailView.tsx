"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import RightNowActivityOrderDetail from "../components/RightNowActivityOrderDetail";
import { Icon } from "@iconify/react";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "@/views/template1/rightnowactivity-recruitment-order/rightnowactivity-order-interface";
// 增加服務商數量彈窗
import RightNowActivityOrderChangeRequiredProviderCountModal from "../rightnowactivity-recruitment-order/components/RightNowActivityOrderChangeRequiredProviderCountModal";
// 取消活動彈窗
import RightNowActivityOrderCancelModal from "../rightnowactivity-recruitment-order/components/RightNowActivityOrderCancelModal";
// 聯絡我們 ui
import ContactWe from "../components/ContactWe";
import { GetRightNowActivityOrderDetailAPI } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI";

/**
 * 即刻快閃訂單詳細資料
 * @param param0
 * @returns
 */
export default function RightNowActivityOrderDetailView({ lng, orderID }: { lng: string; orderID: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    type DisplayOrder = {
        datas: {
            label: string;
            value: string;
            column: string;
        }[];
    };
    const backList = () => {
        router.push("/");
    };

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

    const RenderTitle = () => (
        <div className="flex items-center mb-[40px] font-bold">
            <Icon
                className="text-3xl cursor-pointer text-black"
                icon="iconamoon:arrow-left-2-light"
                onClick={backList}
            />
            <h1 className="text-black w-full text-md-title text-center">{t("rightNowActivityOrderDetail.title")}</h1>
        </div>
    );

    const RenderButton = () => (
        <div className="flex flex-col">
            <button
                onClick={openChangeRequiredProviderCountModal}
                className="border border-primary text-primary h-[45px] w-full mb-[15px]"
            >
                {t("rightNowActivityOrderRecruitmentDetail.button-addRequiredProviderCount")}
            </button>
            <button
                onClick={openCancelOrderModal}
                className="border border-gray-third text-gray-third h-[45px] w-full"
            >
                {t("global.cancel-activity")}
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

    /**
     * 取得訂單資料
     */
    const getOrder = useCallback(async (data: string) => {
        try {
            const res = await GetRightNowActivityOrderDetailAPI(data);
            console.log("GetRightNowActivityOrderDetailAPI => ", res);
        } catch (err) {
            console.log("GetRightNowActivityOrderDetailAPI err => ", err);
            throw err;
        }
    }, []);

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
        getOrder(orderID);
    }, []);
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
            <RightNowActivityOrderChangeRequiredProviderCountModal
                lng={lng}
                orderID={orderID}
                currentProviderCount={2}
                ref={changeRequiredProviderCountRef}
            />
            <RightNowActivityOrderCancelModal
                lng={lng}
                orderID={orderID}
                description={t("rightNowActivityOrderRecruitmentDetail.cancel.description")}
                isShowCancelAcceptedOrderConfirm={true}
                confirmText={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox")}
                confirmTextDescription={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox-description", { hour: 24, price: 20 })}
                ref={cancelOrderModalRef}
            />
            <ContactWe lng={lng} />
        </div>
    );
}
