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
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { getPartnerStoreInfo } from "@/store-toolkit/stores/partnerStore";
import { rightNowActivityOrderStatusByMemberEnum, rightNowActivityOrderEnrollersStatusEnum, canCancelRightNowActivityOrderStatusEnum } from "@/status-enum/rightnowactivity-order-enum";
import { GetRightNowActivityOrderDetailAPIResInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
import { differenceInSeconds } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import dayjs from "dayjs";
import { firebaseDbCollection } from "@/lib/firebase/firebase-hooks";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import RightNowActivityOrderRecruitmentPendingTitle from "./components/RightNowActivityOrderRecruitmentPendingTitle";
import { GetPartnerStoreInfoAPIResInterface } from "@/api/partnerStoreAPI/partnerStoreAPI-interface";

/**
 * 即刻快閃報名訂單詳情
 * @param param0
 * @returns
 */
export default function RightNowActivityRecruitmentOrderDetailView({ lng, orderID }: { lng: string; orderID: string }) {
    const { t } = useTranslation(lng, "main");

    const title = t("rightNowActivityOrderRecruitmentDetail.title");

    const dispatch = useAppDispatch();

    // userStore
    const userStore = useAppSelector((state) => state.userStore);
    // 使用者 ID
    const userID = userBananaIdSelector(userStore);
    // 判斷是否 firebase 登入成功
    const isFirebaseAuth = useAppSelector((state) => state.userStore.isFirebaseAuth);

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
    const [order, setOrder] = useState<GetRightNowActivityOrderDetailAPIResInterface>();
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
    // 判斷是否等待服務商報名中
    const [isWaitProviderApply, setIsWaitProviderApply] = useState(true);
    // 判斷是否顯示連同已經確認的服務商一般訂單一起取消的選擇框
    const [isShowCancelAcceptedOrderConfirm, setIsShowCancelAcceptedOrderConfirm] = useState(false);
    // 顯示取消活動按鈕
    const [isShowCancelButton, setIsShowCancelButton] = useState(true);
    // 到數計時秒數
    const [countDownSecond, setCountDownSecond] = useState<number>(0);
    // 設定付款方式
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    // 選擇報名服務商名單
    const chooseProviders = useAppSelector((state) => state.orderStore.chooseProviders);

    const [recruitmentContent, setRecruitmentContent] = useState(
        <RightNowActivityOrderLogoAnimation
            lng={lng}
            customClass="pb-[30px] border-b border-gray-light"
        />
    );

    const total = useMemo(() => {
        if (order) {
            const price = order.hourly_pay;
            const duration = order.details.duration;
            console.log("price =>", price);
            console.log("duration =>", duration, order);
            if (price === 0) {
                return t("rightNowActivityOrder.price", { val: price, customPriceByDetail: price });
            }
            return t("rightNowActivityOrder.price", { val: price * duration });
        }
        return t("rightNowActivityOrder.price", { val: 0 });
    }, [displayOrder]);

    let unsuscribeNotify: any = null;
    /**
     * 監聽通知訊息 確認服務商報名狀態
     *
     */
    const listenNotify = async () => {
        const notifyRef = firebaseDbCollection(`notification/${userID}/datas`);
        unsuscribeNotify = notifyRef.where("mark", "in", ["a_01", "a_02", "a_03", "a_04"]).onSnapshot(
            (snapshot: any) => {
                // console.log("work listen notify 2", snapshot);
                snapshot.forEach(async (doc: any) => {
                    // console.log("work listen notify 3 =>", doc.data());
                });
                snapshot.docChanges().forEach(async (change: any) => {
                    if (change.type === "added") {
                        // console.log("新通知: ", change.doc.data());
                        if (orderID === change.doc.data().details.demand.demand_id) {
                            console.log("work listen notify 4 =>", change.doc.id);
                            await getOrder(orderID);
                        }
                    }
                    if (change.type === "modified") {
                        console.log("更改通知: ", change.doc.data());
                    }
                    if (change.type === "removed") {
                        console.log("刪除通知: ", change.doc.data());
                    }
                });
            },
            (error: any) => {
                console.log("監聽即刻快閃通知失敗", userID, error);
            }
        );
    };

    useEffect(() => {
        if (isFirebaseAuth) {
            listenNotify();
        }
        return () => {
            if (unsuscribeNotify) {
                unsuscribeNotify();
            }
        };
    }, [isFirebaseAuth]);

    /**
     * 取得店家資料
     */
    const getPartnerStore = async ({ merchantCode, venueCode }: { merchantCode: string; venueCode?: string | void }): Promise<GetPartnerStoreInfoAPIResInterface> => {
        const { payload }: any = await dispatch(getPartnerStoreInfo({ merchantCode, venueCode }));
        return payload;
    };

    /**
     * 取得訂單資料
     */
    const getOrder = async (orderID: string) => {
        try {
            const res = await GetRightNowActivityOrderDetailAPI({ orderID: orderID, params: { with_review: "1" } });
            // console.log("GetRightNowActivityOrderDetailAPI => ", res);
            const currentDate = new Date();
            const dueAt = res.due_at;
            const countDownSecond = differenceInSeconds(dueAt, currentDate);
            // 判斷大於現在時間時才進行倒數
            if (countDownSecond > 0) {
                // 設定招募倒數計時時間
                setCountDownSecond(countDownSecond);
            } else {
                // 設定目前非等待服務商報名狀態
                setIsWaitProviderApply(false);
            }
            /**
             * 活動還沒開始狀態 0,1
             * 設定是否顯示取消訂單按鈕 當有服務商報名時 且訂單狀態等於 0 開放報名中 或 等於 1 報名額滿 時
             * 扔然可以讓他取消單是需連同一般預訂單一起取消 所以顯示取消活動按鈕
             */
            setIsShowCancelButton([canCancelRightNowActivityOrderStatusEnum.Pending, canCancelRightNowActivityOrderStatusEnum.RegistrationFull].includes(res.status));
            setOrder(res);
            // 設定付款方式
            setPaymentMethod(res.paid_by === 1 ? "cash" : "other");
            // 判斷有服務商報名時觸發
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

                // 設定服務商資料
                const setDatas: RightNowActivityOrderDetailProviderSigupCardInterface[] = res.enrollers.map((item) => {
                    // 職業
                    const findJob = Array.isArray(item.user!.occupation) && item.user!.occupation.length > 0 ? (item.user!.occupation[0].id === "JOB-OTHERS" ? item.user!.occupation[0].description : item.user!.occupation[0].name) : "";
                    // 判斷是否為快閃皇后
                    const isQueen = Array.isArray(item.user!.badges) && item.user!.badges.length > 0 ? item.user!.badges.find((badge) => badge.id === 1) !== undefined : false;
                    // 評論
                    const comments: RightNowActivityOrderProviderCommentInterface[] | null = Array.isArray(item.user?.dating_reviews)
                        ? item.user.dating_reviews.map((data) => {
                              return {
                                  name: data.reviewer_name,
                                  avatar: data.reviewer_avatar,
                                  rate: data.score,
                                  content: data.comment,
                              };
                          })
                        : null;

                    return {
                        id: String(item.id)!,
                        name: item.user!.name!,
                        cover: item.user!.thumbnails !== undefined && item.user!.thumbnails.cover !== undefined ? item.user!.thumbnails.cover["360x360"] : item.user!.cover!,
                        rate: item.user!.rating_score!,
                        unit: res.details.unit!,
                        height: item.user!.height!,
                        weight: item.user!.weight!,
                        travelTime: item.travel_time!,
                        isNowTime: res.at_any_time!,
                        price: item.hourly_pay!,
                        job: findJob,
                        authentication: true,
                        isQueen,
                        area: item.user!.district!,
                        enrollerStatus: item.status,
                        providerID: item.user!.banana_id,
                        comments,
                        description: item.user!.description,
                    };
                });
                setProviders(setDatas);
            } else {
                setProviders([]);
                // 設定目前非等待服務商報名狀態
                setIsWaitProviderApply(true);
            }
            return res;
        } catch (err) {
            console.log("GetRightNowActivityOrderDetailAPI err => ", err);
            throw err;
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const [fetchOrder] = await Promise.all([getOrder(orderID)]);
            const [fetchStore] = await Promise.all([getPartnerStore({ merchantCode: fetchOrder!.details.merchant.merchant_code, venueCode: fetchOrder!.details.merchant.venue_code })]);
            console.log("fetchStore =>", fetchStore);
            if (fetchOrder && fetchStore) {
                setDisplayOrder({
                    datas: [
                        // 店家資料
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-store"), value: fetchStore.merchant.name, column: "column-store" },
                        // 活動開始時間
                        {
                            label: t("rightNowActivityOrderRecruitmentDetail.column-startDate"),
                            value: fetchOrder.started_at === null ? t("rightNowActivityOrderPayment.startTime-now") : fetchOrder.started_at !== null ? dayjs(fetchOrder.started_at).format("YYYY-MM-DD HH:mm") : "",
                            column: "column-startDate",
                        },
                        // 特殊需求備註
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-note"), value: fetchOrder.requirement === null ? "" : fetchOrder.requirement, column: "column-note" },
                        // 服務商需求數量
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-requiredProviderCount"), value: t("rightNowActivityOrderRecruitmentDetail.value-requiredProviderCount", { val: fetchOrder.provider_required }), column: "column-requiredProviderCount" },
                        // 活動時長 時數或天數
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-duration"), value: t("rightNowActivityOrderRecruitmentDetail.value-duration", { val: fetchOrder.details.duration }), column: "column-duration" },
                        // 付款方式
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-paymentMethod"), value: fetchOrder.paid_by === 1 ? t("global.paymentMethod-cash") : t("rightNowActivityOrderRecruitmentDetail.value-paymentMethod-creditCard"), column: "column-paymentMethod" },
                    ],
                });
            }
        } catch (err) {
            console.log("fetchData err=>", err);
        }
    }, []);

    // 服務商已選擇數量
    const checkedProviders = useMemo(() => {
        if (order && Array.isArray(order.enrollers)) {
            return order.enrollers.filter((item) => item.status === 1).length;
        }
        return 0;
    }, [providers]);

    // 顯示服務商報名區塊
    const showProviderSignup = useMemo(() => {
        if (order && (order.status < rightNowActivityOrderStatusByMemberEnum.Rejected || (order.status >= rightNowActivityOrderStatusByMemberEnum.Rejected && Array.isArray(order.enrollers) && order.enrollers.length > 0))) {
            return true;
        }
        return false;
    }, [order]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (displayOrder && Array.isArray(displayOrder.datas)) {
            setOrderTopContent({ datas: displayOrder.datas.filter((data) => displayOrderTopKeys.includes(data.column)) });
            setOrderPaymentContent({
                datas: displayOrder.datas.filter((data) => displayOrderPaymentKeys.includes(data.column)),
            });
        }
    }, [displayOrder]);

    useEffect(() => {
        // 判斷有服務商報名時顯示服務商報名列表
        if ((providers.length > 0 && order) || (!isWaitProviderApply && order)) {
            setRecruitmentContent(
                <RightNowActivityOrderProviderSignUp
                    lng={lng}
                    orderStatus={order.status}
                    orderID={order.demand_id}
                    providers={providers}
                    checkedProviders={checkedProviders}
                    providerRequiredCount={order.provider_required}
                    paymentMethod={paymentMethod}
                />
            );
        } else {
            setRecruitmentContent(
                <RightNowActivityOrderLogoAnimation
                    lng={lng}
                    customClass="pb-[30px] border-b border-gray-light"
                />
            );
        }
    }, [providers, isWaitProviderApply]);

    return (
        <>
            <TitleCompoent title={title} />
            <div className="mx-auto max-w-[400px] mt-[40px]">
                {/* 倒數計時與狀態標題跟描述 */}
                {order && (
                    <RightNowActivityOrderRecruitmentPendingTitle
                        lng={lng}
                        order={order}
                    />
                )}
                <RightNowActivityOrderTopContent
                    showButton={true}
                    lng={lng}
                    values={orderTopContent?.datas}
                    customClass="border-b border-gray-light pb-[30px] px-5"
                />
                {/* 選擇服務商報名區塊 */}
                {showProviderSignup && (
                    <RightNowActivityOrderRecruitment
                        lng={lng}
                        customClass="mt-[80px] pb-[30px] px-5"
                        conuntDownSecond={countDownSecond}
                        render={() => recruitmentContent}
                    />
                )}

                <RightNowActivityOrderPaymentContent
                    lng={lng}
                    values={orderPaymentContent?.datas}
                    customClass="border-b border-gray-light py-[30px] px-5"
                />
                {order && (
                    <RightNowActivityOrderTotal
                        lng={lng}
                        total={total}
                        price={order.hourly_pay}
                        customClass="px-5"
                    />
                )}
                <div className="flex flex-col px-5">
                    {/* 判斷是否顯示修改服務商數量按鈕 */}
                    {isShowCancelButton && (
                        <button
                            onClick={openChangeRequiredProviderCountModal}
                            type="button"
                            className="text-white border bg-primary border-primary rounded-md h-[45px] flex items-center justify-center"
                        >
                            {t("rightNowActivityOrderRecruitmentDetail.button-addRequiredProviderCount")}
                        </button>
                    )}
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
                <div className="h-[123px] w-full"></div>
            </div>
            {/* 增加需求人數確認彈窗 */}
            {order && (
                <RightNowActivityOrderChangeRequiredProviderCountModal
                    lng={lng}
                    orderID={order.demand_id}
                    currentProviderCount={order.provider_required}
                    getOrder={getOrder}
                    ref={changeRequiredProviderCountRef}
                />
            )}
            {/* 取消活動確認彈窗 */}
            {order && (
                <RightNowActivityOrderCancelModal
                    lng={lng}
                    rightNowActivityID={order.demand_id}
                    description={t("rightNowActivityOrderRecruitmentDetail.cancel.description")}
                    confirmText={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox")}
                    confirmTextDescription={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox-description", { hour: 24, price: 20 })}
                    isShowCancelAcceptedOrderConfirm={isShowCancelAcceptedOrderConfirm}
                    ref={cancelOrderModalRef}
                />
            )}
        </>
    );
}
