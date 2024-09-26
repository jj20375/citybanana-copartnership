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
// 聯絡我們 ui
import ContactWe from "../components/ContactWe";
// 即刻快閃總計
import RightNowActivityOrderTotal from "./components/RightNowActivityOrderTotal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type RightNowActivityOrderDetailProviderSigupCardInterface, RightNowActivityOrderProviderCommentInterface } from "./rightnowactivity-order-interface";
import { GetRightNowActivityOrderDetailAPI } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI";

/**
 * 即刻快閃報名訂單詳情
 * @param param0
 * @returns
 */
export default function RightNowActivityRecruitmentOrderDetailView({ lng, orderID }: { lng: string; orderID: string }) {
    const { t } = useTranslation(lng, "main");

    const title = t("rightNowActivityOrderRecruitmentDetail.title");

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

    // 原始訂單資料
    const [order, setOrder] = useState<any>({});
    // 顯示訂單資料
    const [displayOrder, setDisplayOrder] = useState<DisplayOrder>();
    // 訂單上方資料
    const [orderTopContent, setOrderTopContent] = useState<DisplayOrder>();
    // 訂單付款資料
    const [orderPaymentContent, setOrderPaymentContent] = useState<DisplayOrder>();
    // 訂單細節上方資料顯示 key
    const displayOrderTopKeys = ["column-store", "column-startDate", "column-note"];
    // 訂單細節付款資料顯示 key
    const displayOrderPaymentKeys = ["column-requiredProviderCount", "column-price", "column-duration", "column-paymentMethod"];
    // 報名服務商
    const [providers, setProviders] = useState<RightNowActivityOrderDetailProviderSigupCardInterface[]>([]);
    // 選擇服務商資料
    const [chooseValues, setChooseValues] = useState([]);
    // 服務商評論資料
    const [comments, setComments] = useState<RightNowActivityOrderProviderCommentInterface[]>([]);
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
                { label: t("rightNowActivityOrderRecruitmentDetail.column-store"), value: "測試商家", column: "column-store" },
                { label: t("rightNowActivityOrderRecruitmentDetail.column-startDate"), value: "服務商到場時間", column: "column-startDate" },
                { label: t("rightNowActivityOrderRecruitmentDetail.column-note"), value: "測試活動備註", column: "column-note" },
                { label: t("rightNowActivityOrderRecruitmentDetail.column-requiredProviderCount"), value: t("rightNowActivityOrderRecruitmentDetail.value-requiredProviderCount", { val: 1 }), column: "column-requiredProviderCount" },
                { label: t("rightNowActivityOrderRecruitmentDetail.column-price"), value: t("rightNowActivityOrder.price", { val: 0, customPriceByDetailHourPrice: 0 }), column: "column-price" },
                { label: t("rightNowActivityOrderRecruitmentDetail.column-duration"), value: t("rightNowActivityOrderRecruitmentDetail.value-duration", { val: 3 }), column: "column-duration" },
                { label: t("rightNowActivityOrderRecruitmentDetail.column-paymentMethod"), value: t("rightNowActivityOrderRecruitmentDetail.value-paymentMethod-creditCard"), column: "column-paymentMethod" },
            ],
        };
        setOrderTopContent({ datas: apiDatas.datas.filter((data) => displayOrderTopKeys.includes(data.column)) });
        setOrderPaymentContent({
            datas: apiDatas.datas.filter((data) => displayOrderPaymentKeys.includes(data.column)),
        });
        setDisplayOrder(apiDatas);
        setOrder({
            id: "123",
            price: 0,
            duration: 2,
        });

        setProviders(
            Array.from({ length: 10 }).map((_, i) => ({
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
            }))
        );
        setComments(
            Array.from({ length: 10 }).map((_, i) => ({
                id: `comment-${i}`,
                name: "test2-" + i,
                avatar: `https://picsum.photos/id/${i + 10}/300/300`,
                rate: 4.5,
                content:
                    "Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还通过了电子排版的挑战，其雏形却依然保存至今。在1960年代，”Leatraset”公司发布了印刷着Lorem Ipsum段落的纸张，从而广泛普及了它的使用。最近，计算机桌面出版软件”Aldus PageMaker”也通过同样的方式使Lorem Ipsum落入大众的视野。",
                createdAt: "2024/02/25",
            }))
        );
    }, []);
    useEffect(() => {
        if (providers.length > 0) {
            setRecruitmentContent(
                <RightNowActivityOrderProviderSignUp
                    lng={lng}
                    orderId={order.id}
                    providers={providers}
                    comments={comments}
                    isSigleChoose={false}
                    parentValues={chooseValues}
                    setParentValues={setChooseValues}
                />
            );
        }
    }, [providers]);

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
        getOrder(orderID);
    }, []);

    return (
        <>
            <TitleCompoent title={title} />
            <div className="mx-auto max-w-[400px] mt-[40px]">
                <RightNowActivityOrderTopContent
                    showButton={true}
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
                <RightNowActivityOrderTotal
                    lng={lng}
                    total={total}
                    price={order.price}
                />
                <div className="flex flex-col">
                    <button
                        onClick={openChangeRequiredProviderCountModal}
                        type="button"
                        className="text-primary border border-primary rounded-md h-[45px] flex items-center justify-center"
                    >
                        {t("rightNowActivityOrderRecruitmentDetail.button-addRequiredProviderCount")}
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
                description={t("rightNowActivityOrderRecruitmentDetail.cancel.description")}
                needConfirm={true}
                confirmText={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox")}
                confirmTextDescription={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox-description", { hour: 24, price: 20 })}
                ref={cancelOrderModalRef}
            />
        </>
    );
}
