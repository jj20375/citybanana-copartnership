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
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { usePartnerStoreNameSelector } from "@/store-toolkit/stores/partnerStore";
import { GetJobListAPI } from "@/api/utilsAPI/utilsAPI";
import { GetJobListAPIResInterface } from "@/api/utilsAPI/utilsAPI-interface";
import { rightNowActivityOrderStatusByMemberEnum, rightNowActivityOrderEnrollersStatusEnum } from "@/status-enum/rightnowactivity-order-enum";
/**
 * 即刻快閃報名訂單詳情
 * @param param0
 * @returns
 */
export default function RightNowActivityRecruitmentOrderDetailView({ lng, orderID }: { lng: string; orderID: string }) {
    const { t } = useTranslation(lng, "main");

    const title = t("rightNowActivityOrderRecruitmentDetail.title");

    // 合作店家資料
    const partnerStore = useAppSelector((state) => state.partnerStore);
    // 合作店家名稱
    const partnerStoreName = usePartnerStoreNameSelector(partnerStore);

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
    // 判斷是否顯示連同已經確認的服務商一般訂單一起取消的選擇框
    const [isShowCancelAcceptedOrderConfirm, setIsShowCancelAcceptedOrderConfirm] = useState(false);
    // 顯示取消活動按鈕
    const [isShowCancelButton, setIsShowCancelButton] = useState(true);

    const [recruitmentContent, setRecruitmentContent] = useState(
        <RightNowActivityOrderLogoAnimation
            lng={lng}
            customClass="pb-[30px] border-b border-gray-light"
        />
    );

    const total = useMemo(() => {
        const price = order.hourly_pay;
        const duration = order.duration;
        if (price === 0) {
            return t("rightNowActivityOrder.price", { val: price, customPriceByDetail: price });
        }
        return t("rightNowActivityOrder.price", { val: price * duration });
    }, [displayOrder]);

    const [jobs, setJos] = useState<{ id: string; name: string }[] | []>([]);

    /**
     * 取得職業列表
     */
    const getJobs = useCallback(async () => {
        try {
            const res = await GetJobListAPI();
            setJos(res.occupations);
        } catch (err) {
            throw err;
        }
    }, []);
    /**
     * 取得訂單資料
     */
    const getOrder = useCallback(async (data: string) => {
        try {
            const res = await GetRightNowActivityOrderDetailAPI(data);
            console.log("GetRightNowActivityOrderDetailAPI => ", res);
            // 設定是否顯示取消訂單按鈕 當訂單狀態 小於2時 代表活動還沒開始
            setIsShowCancelButton(res.status < 2);
            setOrder(res);
            setDisplayOrder({
                datas: [
                    // 店家資料
                    { label: t("rightNowActivityOrderRecruitmentDetail.column-store"), value: partnerStoreName, column: "column-store" },
                    // 活動開始時間
                    { label: t("rightNowActivityOrderRecruitmentDetail.column-startDate"), value: res.started_at === null ? t("rightNowActivityOrderPayment.startTime-now") : res.started_at, column: "column-startDate" },
                    // 特殊需求備註
                    { label: t("rightNowActivityOrderRecruitmentDetail.column-note"), value: res.requirement, column: "column-note" },
                    // 服務商需求數量
                    { label: t("rightNowActivityOrderRecruitmentDetail.column-requiredProviderCount"), value: t("rightNowActivityOrderRecruitmentDetail.value-requiredProviderCount", { val: res.provider_required }), column: "column-requiredProviderCount" },
                    // 活動時長 時數或天數
                    { label: t("rightNowActivityOrderRecruitmentDetail.column-duration"), value: t("rightNowActivityOrderRecruitmentDetail.value-duration", { val: res.details.duration }), column: "column-duration" },
                    // 付款方式
                    { label: t("rightNowActivityOrderRecruitmentDetail.column-paymentMethod"), value: res.paid_by === 1 ? t("global.paymentMethod-cash") : t("rightNowActivityOrderRecruitmentDetail.value-paymentMethod-creditCard"), column: "column-paymentMethod" },
                ],
            });
            if (Array.isArray(res.enrollers) && res.enrollers.length > 0) {
                /**
                 * 當有顯示取消活動按鈕 不執行 否則為以下規則
                 * 設定是否顯示取消訂單按鈕 當有服務商報名時 且訂單狀態大於或等於2 時 扔然可以讓他取消
                 * 單是需連同一般預訂單一起取消 所以顯示取消活動按鈕
                 */
                if (!isShowCancelButton) {
                    setIsShowCancelButton(res.status >= rightNowActivityOrderStatusByMemberEnum.Rejected);
                }
                /**
                 * 判斷是否顯示已經確認的服務商在取消活動時
                 * 連同已確認的一般預訂單一起取消
                 * enrollers 裡面的 status = 1 代表已確認服務商
                 */
                setIsShowCancelAcceptedOrderConfirm(res.enrollers.some((item) => item.status === rightNowActivityOrderEnrollersStatusEnum.Confirmed));

                const setDatas: RightNowActivityOrderDetailProviderSigupCardInterface[] = res.enrollers.map((item) => {
                    const findJob = Array.isArray(item.user!.occupation) ? jobs.find((job) => job.id === item.user!.occupation[0].id) : undefined;
                    const isQueen = Array.isArray(item.user!.badges) && item.user!.badges.length > 0 ? item.user!.badges.find((badge) => badge.id === 0) !== undefined : false;
                    console.log("item.user!.occupation =>", item.user!.occupation);
                    return {
                        id: item.id!,
                        name: item.user!.name!,
                        cover: item.user!.thumbnails !== undefined && item.user!.thumbnails.cover !== undefined ? item.user!.thumbnails.cover["360x360"] : item.user!.cover!,
                        rate: item.user!.rating_score!,
                        unit: res.details.unit!,
                        height: item.user!.height!,
                        weight: item.user!.weight!,
                        travelTime: item.travel_time!,
                        isNowTime: res.at_any_time!,
                        price: item.hourly_pay!,
                        job: Array.isArray(item.user!.occupation) ? (item.user!.occupation[0].id === "JOB-OTHERS" ? item.user!.occupation[0].description : findJob !== undefined ? findJob.name : undefined) : undefined,
                        authentication: true,
                        isQueen,
                        area: item.user!.district!,
                    };
                });
                setProviders(setDatas);
            }
        } catch (err) {
            console.log("GetRightNowActivityOrderDetailAPI err => ", err);
            throw err;
        }
    }, []);

    useEffect(() => {
        getJobs();
        getOrder(orderID);
    }, []);

    useEffect(() => {
        // setProviders(
        //     Array.from({ length: 10 }).map((_, i) => ({
        //         id: `provider-${i}`,
        //         name: "test1-" + i,
        //         cover: `https://picsum.photos/id/${i + 10}/300/300`,
        //         rate: 4.5,
        //         description:
        //             "Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还通过了电子排版的挑战，其雏形却依然保存至今。在1960年代，”Leatraset”公司发布了印刷着Lorem Ipsum段落的纸张，从而广泛普及了它的使用。最近，计算机桌面出版软件”Aldus PageMaker”也通过同样的方式使Lorem Ipsum落入大众的视野。",
        //         unit: "hour",
        //         height: 160,
        //         weight: 70,
        //         age: 35,
        //         travelTime: 35,
        //         isNowTime: true,
        //         price: 2000,
        //         area: "TW-TPE",
        //         job: "金融業",
        //         authentication: true,
        //         isQueen: true,
        //     }))
        // );
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
        if (displayOrder) {
            setOrderTopContent({ datas: displayOrder.datas.filter((data) => displayOrderTopKeys.includes(data.column)) });
            setOrderPaymentContent({
                datas: displayOrder.datas.filter((data) => displayOrderPaymentKeys.includes(data.column)),
            });
        }
    }, [displayOrder]);
    useEffect(() => {
        if (providers.length > 0) {
            setRecruitmentContent(
                <RightNowActivityOrderProviderSignUp
                    lng={lng}
                    orderID={order.demand_id}
                    providers={providers}
                    comments={comments}
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
                    showButton={true}
                    lng={lng}
                    values={orderTopContent?.datas}
                    customClass="border-b border-gray-light pb-[30px]"
                />
                {JSON.stringify(chooseValues)}
                {/* 倒數計時區塊 */}
                <RightNowActivityOrderRecruitment
                    lng={lng}
                    customClass="mt-[30px] pb-[30px]"
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
                    price={order.hourly_pay}
                />
                <div className="flex flex-col">
                    <button
                        onClick={openChangeRequiredProviderCountModal}
                        type="button"
                        className="text-primary border border-primary rounded-md h-[45px] flex items-center justify-center"
                    >
                        {t("rightNowActivityOrderRecruitmentDetail.button-addRequiredProviderCount")}
                    </button>
                    {/* 判斷是否顯示取消活動按鈕 */}
                    {isShowCancelButton && (
                        <button
                            onClick={openCancelOrderModal}
                            type="button"
                            className="mt-[15px] text-gray-third border border-gray-third rounded-md h-[45px] flex items-center justify-center"
                        >
                            {t("global.cancel-activity")}
                        </button>
                    )}
                </div>
                <ContactWe lng={lng} />
                <div className="h-[123px] w-full"></div>
            </div>
            {/* 增加需求人數確認彈窗 */}
            <RightNowActivityOrderChangeRequiredProviderCountModal
                lng={lng}
                orderID={order.demand_id}
                currentProviderCount={2}
                ref={changeRequiredProviderCountRef}
            />
            {/* 取消活動確認彈窗 */}
            <RightNowActivityOrderCancelModal
                lng={lng}
                orderID={order.demand_id}
                description={t("rightNowActivityOrderRecruitmentDetail.cancel.description")}
                confirmText={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox")}
                confirmTextDescription={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox-description", { hour: 24, price: 20 })}
                isShowCancelAcceptedOrderConfirm={isShowCancelAcceptedOrderConfirm}
                ref={cancelOrderModalRef}
            />
        </>
    );
}
