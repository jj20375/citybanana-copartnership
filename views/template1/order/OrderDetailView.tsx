"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import RightNowActivityOrderDetail from "../components/RightNowActivityOrderDetail";
import { Icon } from "@iconify/react";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "@/views/template1/rightnowactivity-recruitment-order/rightnowactivity-order-interface";
// 取消活動彈窗
import RightNowActivityOrderCancelModal from "../rightnowactivity-recruitment-order/components/RightNowActivityOrderCancelModal";
// 聯絡我們 ui
import ContactWe from "../components/ContactWe";
import { GetRightNowActivityOrderDetailAPI } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI";
import { GetRightNowActivityOrderDetailAPIResInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
import { rightNowActivityOrderStatusByMemberEnum } from "@/status-enum/rightnowactivity-order-enum";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { getPartnerStoreInfo, usePartnerStoreNameSelector } from "@/store-toolkit/stores/partnerStore";
import dayjs from "dayjs";
import RightNowActivityOrderByProviderContent from "../rightnowactivity-order/components/RightNowActivityOrderByProviderContent";
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
    const backList = () => {
        router.push("/rightnowactivity-order/list/starting");
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
    // 顯示取消活動按鈕
    const [isShowCancelButton, setIsShowCancelButton] = useState(true);

    const [provider, setProvider] = useState<RightNowActivityOrderDetailProviderSigupCardInterface>();

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
                case orderStatusByMemberEnum.MemberTemporaryCancelled: {
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
                    onClick={backList}
                />
                <h1 className="text-black w-full text-md-title text-center">{title}</h1>
            </div>
        );
    };

    const RenderButton = () => (
        <div className="flex flex-col">
            <button
                onClick={openCancelOrderModal}
                className="border border-gray-third text-gray-third h-[45px] w-full rounded"
            >
                {t("global.cancel-order")}
            </button>
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
                    description =
                        orderData.at_any_time && provider ? (
                            <div className="test-center">
                                {t("orderDetail.status-confirmed.travelTime-description")}
                                <strong className="text-primary">{provider.travelTime ? dayjs().add(provider.travelTime, "minutes").format("YYYY-MM-DD HH:mm") : null}</strong>
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
                // 已確認
                case orderStatusByMemberEnum.Confirmed: {
                    description = <div></div>;
                    break;
                }
                // 進行中
                case orderStatusByMemberEnum.InProgress: {
                    description = <div></div>;
                    break;
                }
                // 已完成
                case orderStatusByMemberEnum.Completed: {
                    description = <div></div>;
                    break;
                }
                // 已完成結案(目前用不到)
                case orderStatusByMemberEnum.CompletedClose: {
                    description = <div></div>;
                    break;
                }
                // 爭議處理完成
                case orderStatusByMemberEnum.DisputeResolution: {
                    description = <div></div>;
                    break;
                }
                // 服務商取消或系統自動取消
                case orderStatusByMemberEnum.ProviderOrSystemCancelled: {
                    description = <div></div>;
                    break;
                }
                // 會員取消
                case orderStatusByMemberEnum.MemberCancelled: {
                    description = <div></div>;
                    break;
                }
                // 會員臨時取消
                case orderStatusByMemberEnum.MemberTemporaryCancelled: {
                    description = <div></div>;
                    break;
                }
                // 爭議處理中
                case orderStatusByMemberEnum.DisputePending: {
                    description = <div></div>;
                    break;
                }
                default: {
                    description = <div></div>;
                }
            }
        }

        return description;
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
                /**
                 * 當有顯示取消活動按鈕 不執行 否則為以下規則
                 * 設定是否顯示取消訂單按鈕 當有服務商報名時 且訂單狀態大於或等於2 時 扔然可以讓他取消
                 * 單是需連同一般預訂單一起取消 所以顯示取消活動按鈕
                 */
                if (!isShowCancelButton) {
                    setIsShowCancelButton(res.status >= rightNowActivityOrderStatusByMemberEnum.Rejected);
                }

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
                }
            }
            return res;
            console.log("GetRightNowActivityOrderDetailAPI => ", res);
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

    return (
        <div className="mx-auto max-w-[400px] mt-[40px]">
            {displayOrder && provider && order ? (
                <RightNowActivityOrderDetail
                    lng={lng}
                    renderTitle={RenderTitle()}
                    renderContent={RenderContent({ providers: [provider], orderData: order })}
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
            <ContactWe lng={lng} />
        </div>
    );
}
