"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import RightNowActivityOrderDetail from "../components/RightNowActivityOrderDetail";
import { Icon } from "@iconify/react";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "@/views/template1/rightnowactivity-recruitment-order/rightnowactivity-order-interface";
// 取消活動彈窗
import RightNowActivityOrderCancelModal from "../rightnowactivity-recruitment-order/components/RightNowActivityOrderCancelModal";
import { GetRightNowActivityOrderDetailAPI } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI";
import { GetRightNowActivityOrderDetailAPIResInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { getPartnerStoreInfo, usePartnerStoreNameSelector } from "@/store-toolkit/stores/partnerStore";
import dayjs from "dayjs";
import { orderStatusByMemberEnum } from "@/status-enum/order-enum";
import { GetPartnerStoreInfoAPIResInterface } from "@/api/partnerStoreAPI/partnerStoreAPI-interface";

/**
 * 一般訂單詳細資料
 * @param param0
 * @returns
 */
export default function OrderDetailView({ lng, providerID, rightNowActivityID }: { lng: string; providerID: string; rightNowActivityID: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();
    const dispatch = useAppDispatch();

    // 合作店家資料
    const partnerStore = useAppSelector((state) => state.partnerStore);
    // 合作店家名稱
    const partnerStoreName = usePartnerStoreNameSelector(partnerStore);

    type DisplayOrder = {
        datas: {
            label: string;
            value: string;
            column: string;
        }[];
    };

    // 取消活動彈窗 dom
    const cancelOrderModalRef = useRef<any>();

    // 開啟取消活動彈窗
    const openCancelOrderModal = () => {
        cancelOrderModalRef.current.openModal();
    };

    const [order, setOrder] = useState<GetRightNowActivityOrderDetailAPIResInterface>();
    // 顯示訂單資料
    const [displayOrder, setDisplayOrder] = useState<DisplayOrder>();

    const [provider, setProvider] = useState<RightNowActivityOrderDetailProviderSigupCardInterface>();

    // 跳轉服務商聊天室
    const goToChatRoom = (id: string) => {
        router.push(`/join-providers-chatroom/${id}`);
    };

    // 跳轉訂單列表
    const goToOrderList = () => {
        router.push("/rightnowactivity-order/list/starting");
    };

    /**
     * 取得店家資料
     */
    const getPartnerStore = async ({ merchantCode, venueCode }: { merchantCode: string; venueCode?: string | void }): Promise<GetPartnerStoreInfoAPIResInterface> => {
        const { payload }: any = await dispatch(getPartnerStoreInfo({ merchantCode, venueCode }));
        return payload;
    };

    /**
     * 取得即刻快閃訂單資料
     */
    const getRightNowActivityOrder = async (rightNowActivityID: string) => {
        try {
            const res = await GetRightNowActivityOrderDetailAPI({ orderID: rightNowActivityID });
            setOrder(res);

            if (Array.isArray(res.enrollers) && res.enrollers.length > 0) {
                const setDatas: RightNowActivityOrderDetailProviderSigupCardInterface | undefined = res.enrollers
                    .map((item) => {
                        const findJob = Array.isArray(item.user!.occupation) && item.user!.occupation.length > 0 ? (item.user!.occupation[0].id === "JOB-OTHERS" ? item.user!.occupation[0].description : item.user!.occupation[0].name) : "";
                        const isQueen = Array.isArray(item.user!.badges) && item.user!.badges.length > 0 ? item.user!.badges.find((badge) => badge.id === 1) !== undefined : false;
                        return {
                            id: String(item.id!),
                            // 判斷服務商是否有預訂單
                            haveDating: item.dating !== null ? true : false,
                            name: item.user!.name!,
                            cover: item.user!.thumbnails !== undefined && item.user!.thumbnails.cover !== undefined ? item.user!.thumbnails.cover["360x360"] : item.user!.cover!,
                            rate: item.user!.rating_score!,
                            unit: res.details.unit!,
                            height: item.user!.height!,
                            weight: item.user!.weight!,
                            travelTime: item.travel_time!,
                            isNowTime: res.at_any_time!,
                            price: item.hourly_pay!,
                            authentication: true,
                            isQueen,
                            area: item.user!.district!,
                            enrollerStatus: item.status,
                            job: findJob,
                            providerID: item.user!.banana_id,
                            orderID: item.dating !== null && item.dating !== undefined ? item.dating.order_id : "",
                            // 一般預訂單資料
                            datingOrder: item.dating ? item.dating : null,
                        };
                    })
                    .find((item) => item.providerID === providerID);
                if (setDatas !== undefined) {
                    setProvider(setDatas);

                    // 可以進行取消的訂單狀態 (未付款｜等待確認｜已確認)
                    const canToCancelStatus = () => {
                        if (setDatas && setDatas.datingOrder && setDatas.datingOrder.status < orderStatusByMemberEnum.InProgress && setDatas.datingOrder.status >= orderStatusByMemberEnum.Unpaid) {
                            return true;
                        }
                        return false;
                    };
                    // 判斷開始時間大於現在時間 且大於5分鐘時才觸發倒數計時 取為可以取消的訂單狀態
                    if (canToCancelStatus() && dayjs(res.started_at).isValid() && dayjs(res.started_at) > dayjs().add(5, "minutes")) {
                        setIsCounting(true);
                    } else if (canToCancelStatus() && res.started_at === null) {
                        // 當為現在時間得即刻快閃單時可以開放取消訂單機制但必須為可以取消的訂單狀態
                        setIsCounting(true);
                    }
                }
            }
            console.log("GetRightNowActivityOrderDetailAPI => ", res);
            return res;
        } catch (err) {
            console.log("GetRightNowActivityOrderDetailAPI err => ", err);
            throw err;
        }
    };

    const fetchData = useCallback(async (rightNowActivityID: string) => {
        try {
            const [fetchOrder] = await Promise.all([getRightNowActivityOrder(rightNowActivityID)]);
            const [fetchStore] = await Promise.all([getPartnerStore({ merchantCode: fetchOrder!.details.merchant.merchant_code, venueCode: fetchOrder!.details.merchant.venue_code })]);
            if (fetchOrder && fetchStore) {
                setDisplayOrder({
                    datas: [
                        // 店家資料
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-store"), value: fetchStore.merchant.name, column: "column-store" },
                        // 活動開始時間
                        {
                            label: t("rightNowActivityOrderRecruitmentDetail.column-startDate"),
                            value: fetchOrder.started_at === null ? t("rightNowActivityOrderPayment.startTime-now") : dayjs(fetchOrder.started_at).isValid() ? dayjs(fetchOrder.started_at).format("YYYY-MM-DD HH:mm") : fetchOrder.started_at,
                            column: "column-startDate",
                        },
                        // 特殊需求備註
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-note"), value: fetchOrder.requirement!, column: "column-note" },
                        // 服務商需求數量
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-requiredProviderCount"), value: t("rightNowActivityOrderRecruitmentDetail.value-requiredProviderCount", { val: fetchOrder.provider_required }), column: "column-requiredProviderCount" },
                        // 每小時或每天單價(出席鐘點費)
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-price"), value: fetchOrder.hourly_pay === 0 ? t("rightNowActivityOrder.price-0") : t("rightNowActivityOrder.price", { val: fetchOrder.hourly_pay }), column: "column-price" },
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

    useEffect(() => {
        fetchData(rightNowActivityID);
    }, []);

    /**
     * 因為有時候合作店家 api 還沒有載入到資料
     * 因此需監聽合作店家名稱有變化時 重新設定 商家名稱
     */
    useEffect(() => {
        if (partnerStoreName !== "" && displayOrder && displayOrder.datas) {
            const index = displayOrder.datas.findIndex((item) => item.column === "column-store");
            const newDatas = (displayOrder.datas[index].value = partnerStoreName);
            setDisplayOrder(newDatas);
        }
    }, [partnerStoreName, displayOrder]);

    // 訂單取消倒數時間
    const [seconds, setSeconds] = useState(300);
    // 判斷是否觸發倒數計時有觸發時顯示取消按鈕
    const [isCounting, setIsCounting] = useState(false);

    const RenderTitle = () => {
        let title = "";
        if (order && provider && provider.datingOrder) {
            // 一般預訂單狀態對應名詞
            switch (provider.datingOrder.status) {
                // 未付款狀態
                case orderStatusByMemberEnum.Unpaid: {
                    title = t("orderDetail.title-status-0");
                    break;
                }
                // 等待確認
                case orderStatusByMemberEnum.WaitingConfirm: {
                    title = t("orderDetail.title-status-1");
                    break;
                }
                // 已確認
                case orderStatusByMemberEnum.Confirmed: {
                    title = t("orderDetail.title-status-2");
                    break;
                }
                // 進行中
                case orderStatusByMemberEnum.InProgress: {
                    title = t("orderDetail.title-status-3");
                    break;
                }
                // 已完成
                case orderStatusByMemberEnum.Completed: {
                    title = t("orderDetail.title-status-4");
                    break;
                }
                // 已完成結案(目前用不到)
                case orderStatusByMemberEnum.CompletedClose: {
                    title = t("orderDetail.title-status-5");
                    break;
                }
                // 爭議處理完成
                case orderStatusByMemberEnum.DisputeResolution: {
                    title = t("orderDetail.title-status-6");
                    break;
                }
                // 服務商取消或系統自動取消
                case orderStatusByMemberEnum.ProviderOrSystemCancelled: {
                    title = t("orderDetail.title-status--1");
                    break;
                }
                // 會員取消
                case orderStatusByMemberEnum.MemberCancelled: {
                    title = t("orderDetail.title-status--2");
                    break;
                }
                // 會員臨時取消
                case orderStatusByMemberEnum.MemberTemporaryCancellation: {
                    title = t("orderDetail.title-status--3");
                    break;
                }
                // 爭議處理中
                case orderStatusByMemberEnum.DisputePending: {
                    title = t("orderDetail.title-status--4");
                    break;
                }
                default: {
                    title = order.status.toString();
                }
            }
        }

        return (
            <div className="flex items-center mb-[40px] font-bold">
                <Icon
                    className="text-3xl cursor-pointer text-black"
                    icon="iconamoon:arrow-left-2-light"
                    onClick={goToOrderList}
                />
                <h1 className="text-black w-full text-md-title text-center">{title}</h1>
            </div>
        );
    };

    const RenderButton = () => (
        <div className="flex flex-col">
            <button
                onClick={() => goToChatRoom(providerID)}
                className="text-white bg-primary h-[45px] w-[400px] rounded border border-primary"
            >
                {t("rightNowActivityJoinProvidersChatRoom.title")}
            </button>
            {isCounting ? (
                <button
                    onClick={openCancelOrderModal}
                    className="text-gray-primary mt-[24px] text-[10px] block disabled:cursor-not-allowed"
                    disabled={!isCounting}
                >
                    {t("global.cancel-order") + `(${seconds}s)`}
                </button>
            ) : (
                <button
                    onClick={goToOrderList}
                    type="button"
                    className="text-gray-primary border border-gray-primary h-[45px] w-[400px] rounded mt-[24px]"
                >
                    {t("global.back")}
                    {t("global.orderList")}
                </button>
            )}
        </div>
    );

    const RenderContent = ({ providers, orderData }: { providers: RightNowActivityOrderDetailProviderSigupCardInterface[]; orderData: GetRightNowActivityOrderDetailAPIResInterface }) => {
        let description = <div></div>;
        if (order && provider && provider.datingOrder) {
            // 一般預訂單狀態對應名詞
            switch (provider.datingOrder.status) {
                // 未付款狀態
                case orderStatusByMemberEnum.Unpaid: {
                    description = <div></div>;
                    break;
                }
                // 等待確認
                case orderStatusByMemberEnum.WaitingConfirm: {
                    description = (
                        <div className="text-center font-bold">
                            {t("orderDetail.status-unconfirmed.description-1")}
                            <strong className="text-primary mx-2">{dayjs(orderData.started_at).isValid() ? dayjs(orderData.started_at).format("YYYY-MM-DD HH:mm") : null}</strong>
                            <div>{t("orderDetail.status-unconfirmed.description-2")}</div>
                        </div>
                    );
                    break;
                }
                // 已確認
                case orderStatusByMemberEnum.Confirmed: {
                    description =
                        orderData.at_any_time && provider ? (
                            <div className="test-center font-bold">
                                {t("orderDetail.status-confirmed.travelTime-description")}
                                <strong className="text-primary mx-2">{provider.travelTime ? dayjs().add(provider.travelTime, "minutes").format("YYYY-MM-DD HH:mm") : null}</strong>
                                {t("orderDetail.status-confirmed.travelTime-description2")}
                            </div>
                        ) : (
                            <div className="text-center font-bold">
                                {t("orderDetail.status-confirmed.description")}
                                <strong className="text-primary mx-2">{dayjs(orderData.started_at).isValid() ? dayjs(orderData.started_at).format("YYYY-MM-DD HH:mm") : orderData.started_at}</strong>
                                {t("global.start")}
                            </div>
                        );
                    break;
                }
                // 進行中
                case orderStatusByMemberEnum.InProgress: {
                    description = (
                        <div className="text-center font-bold">
                            <strong>{t("orderDetail.status-inprogress.description")}</strong>
                            <strong className="text-primary mx-2">{dayjs(orderData.ended_at).isValid() ? dayjs(orderData.ended_at).format("YYYY-MM-DD HH:mm") : orderData.ended_at}</strong>
                            <strong>{t("global.end")}</strong>
                        </div>
                    );
                    break;
                }
                // 已完成
                case orderStatusByMemberEnum.Completed: {
                    description = (
                        <div className="text-center font-bold">
                            <strong>{t("orderDetail.status-completed.description")}</strong>
                            <strong className="text-primary mx-2">{dayjs(orderData.ended_at).isValid() ? dayjs(orderData.ended_at).format("YYYY-MM-DD HH:mm") : orderData.ended_at}</strong>
                        </div>
                    );
                    break;
                }
                // 已完成結案(目前用不到)
                case orderStatusByMemberEnum.CompletedClose: {
                    description = (
                        <div className="text-center font-bold">
                            <strong>{t("orderDetail.status-completed.description")}</strong>
                            <strong className="text-primary mx-2">{dayjs(orderData.ended_at).isValid() ? dayjs(orderData.ended_at).format("YYYY-MM-DD HH:mm") : orderData.ended_at}</strong>
                        </div>
                    );
                    break;
                }
                // 爭議處理完成
                case orderStatusByMemberEnum.DisputeResolution: {
                    description = (
                        <div className="text-center font-bold">
                            <strong>{t("orderDetail.status-completed.description")}</strong>
                            <strong className="text-primary mx-2">{dayjs(orderData.ended_at).isValid() ? dayjs(orderData.ended_at).format("YYYY-MM-DD HH:mm") : orderData.ended_at}</strong>
                        </div>
                    );
                    break;
                }
                // 服務商取消或系統自動取消
                case orderStatusByMemberEnum.ProviderOrSystemCancelled: {
                    if (orderData.details.refusedNote !== undefined) {
                        description = <div className="text-center font-bold">{t("orderDetail.status-provider-or-system-cancelled.description-1")}</div>;
                        return;
                    }
                    if (orderData.recommend_times !== undefined) {
                        description = <div className="text-center font-bold">{t("orderDetail.status-provider-or-system-cancelled.description-2")}</div>;
                        return;
                    }
                    description = <div className="text-center font-bold">{t("orderDetail.status-provider-or-system-cancelled.description-3")}</div>;
                    break;
                }
                // 會員取消
                case orderStatusByMemberEnum.MemberCancelled: {
                    description = <div className="text-center font-bold">{t("orderDetail.status-member-cancelled.description")}</div>;
                    break;
                }
                // 會員臨時取消
                case orderStatusByMemberEnum.MemberTemporaryCancellation: {
                    description = <div className="text-center font-bold">{t("orderDetail.status-member-temporary-cancellation.description", { val: "24" })}</div>;
                    break;
                }
                // 爭議處理中
                case orderStatusByMemberEnum.DisputePending: {
                    description = <div className="text-center font-bold">{t("orderDetail.status-dispute-pending.description", { val: "24" })}</div>;
                    break;
                }
                default:
                    {
                        description = <div></div>;
                    }
                    return description;
            }
        }

        return description;
    };

    /**
     * 倒數計時機制
     */
    useEffect(() => {
        let intervalID: any = null;
        if (isCounting) {
            intervalID = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds <= 1) {
                        if (intervalID !== null) {
                            clearInterval(intervalID);
                        }
                        setIsCounting(false);
                        return 0;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalID);
    }, [isCounting]);

    return (
        <div className="mx-auto max-w-[400px] mt-[40px]">
            {provider && provider.datingOrder ? provider.datingOrder.order_id : ""}
            {displayOrder && provider && order ? (
                <RightNowActivityOrderDetail
                    lng={lng}
                    renderTitle={RenderTitle()}
                    renderContent={RenderContent({ providers: [provider], orderData: order })!}
                    renderButton={RenderButton()}
                    providers={[provider]}
                    displayOrder={displayOrder}
                    orderData={order}
                    labelText={t("rightNowActivityOrderRecruitmentDetail.expectedPayment")}
                />
            ) : null}
            <RightNowActivityOrderCancelModal
                lng={lng}
                providerID={providerID}
                rightNowActivityID={rightNowActivityID}
                orderID={provider?.orderID}
                description={t("orderDetail.cancel.description")}
                isShowCancelAcceptedOrderConfirm={false}
                confirmText={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox")}
                confirmTextDescription={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox-description", { hour: 24, price: 20 })}
                ref={cancelOrderModalRef}
                isCancelOrder={true}
            />
        </div>
    );
}
