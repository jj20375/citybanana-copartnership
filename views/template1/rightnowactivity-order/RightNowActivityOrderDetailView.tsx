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
import type { GetRightNowActivityOrderDetailAPIResInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
import { rightNowActivityOrderStatusByMemberEnum, rightNowActivityOrderEnrollersStatusEnum, canCancelRightNowActivityOrderStatusEnum } from "@/status-enum/rightnowactivity-order-enum";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { getPartnerStoreInfo, usePartnerStoreNameSelector } from "@/store-toolkit/stores/partnerStore";
import dayjs from "dayjs";
import RightNowActivityOrderByProviderContent from "./components/RightNowActivityOrderByProviderContent";
import { GetPartnerStoreInfoAPIResInterface } from "@/api/partnerStoreAPI/partnerStoreAPI-interface";

/**
 * 即刻快閃訂單詳細資料
 * @param param0
 * @returns
 */
export default function RightNowActivityOrderDetailView({ lng, orderID }: { lng: string; orderID: string }) {
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
        router.push("/rightnowactivity-order/list/all");
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

    const [order, setOrder] = useState<GetRightNowActivityOrderDetailAPIResInterface>();
    // 顯示訂單資料
    const [displayOrder, setDisplayOrder] = useState<DisplayOrder>();
    // 報名服務商
    const [providers, setProviders] = useState<RightNowActivityOrderDetailProviderSigupCardInterface[]>([]);
    // 判斷是否顯示連同已經確認的服務商一般訂單一起取消的選擇框
    const [isShowCancelAcceptedOrderConfirm, setIsShowCancelAcceptedOrderConfirm] = useState(false);
    // 顯示取消活動按鈕
    const [isShowCancelButton, setIsShowCancelButton] = useState(true);

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

    const RenderButton = () => {
        if (isShowCancelButton) {
            return (
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
        }
        return null;
    };

    const RenderContent = ({ providers, orderData }: { providers: RightNowActivityOrderDetailProviderSigupCardInterface[]; orderData: GetRightNowActivityOrderDetailAPIResInterface }) => {
        return Array.isArray(providers) && orderData ? (
            <div className="grid grid-cols-3 gap-1 content-end">
                {providers.map((providerData) => (
                    <RightNowActivityOrderByProviderContent
                        key={providerData.id}
                        lng={lng}
                        providerData={providerData}
                        orderData={orderData}
                    />
                ))}
            </div>
        ) : null;
    };

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
            const res = await GetRightNowActivityOrderDetailAPI({ orderID: orderID });
            setOrder(res);
            /**
             * 活動還沒開始狀態 0
             * 設定是否顯示取消訂單按鈕 當有服務商報名時 且訂單狀態等於 0 開放報名中
             * 扔然可以讓他取消單是需連同一般預訂單一起取消 所以顯示取消活動按鈕
             */
            setIsShowCancelButton([canCancelRightNowActivityOrderStatusEnum.Pending].includes(res.status));
            if (Array.isArray(res.enrollers) && res.enrollers.length > 0) {
                /**
                 * 當有顯示取消活動按鈕 不執行 否則為以下規則
                 * 設定是否顯示取消訂單按鈕 當有服務商報名時 且訂單狀態大於或等於2 時 扔然可以讓他取消
                 * 單是需連同一般預訂單一起取消 所以顯示取消活動按鈕
                 */
                if (!isShowCancelButton) {
                    // setIsShowCancelButton(res.status >= rightNowActivityOrderStatusByMemberEnum.Rejected);
                }
                /**
                 * 判斷是否顯示已經確認的服務商在取消活動時
                 * 連同已確認的一般預訂單一起取消
                 * enrollers 裡面的 status = 1 代表已確認服務商
                 */
                setIsShowCancelAcceptedOrderConfirm(res.enrollers.some((item) => item.status === rightNowActivityOrderEnrollersStatusEnum.Confirmed));

                const setDatas: RightNowActivityOrderDetailProviderSigupCardInterface[] = res.enrollers.map((item) => {
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
                        job: findJob,
                        area: item.user!.district!,
                        enrollerStatus: item.status,
                        providerID: item.user!.banana_id,
                    };
                });
                setProviders(setDatas);
            }
            return res;
            console.log("GetRightNowActivityOrderDetailAPI => ", res);
        } catch (err) {
            console.log("GetRightNowActivityOrderDetailAPI err => ", err);
            throw err;
        }
    };

    const fetchData = useCallback(async (orderID: string) => {
        try {
            const [fetchOrder] = await Promise.all([getOrder(orderID)]);
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
        fetchData(orderID);
    }, []);

    return (
        <div className="mx-auto max-w-[400px] mt-[40px]">
            {displayOrder && order ? (
                <RightNowActivityOrderDetail
                    lng={lng}
                    labelText={t("orderDetail.paymentAmount")}
                    renderTitle={RenderTitle()}
                    renderContent={RenderContent({ providers, orderData: order })}
                    renderButton={RenderButton()}
                    providers={providers}
                    displayOrder={displayOrder}
                    orderData={order}
                />
            ) : null}
            {order && (
                <RightNowActivityOrderChangeRequiredProviderCountModal
                    lng={lng}
                    orderID={orderID}
                    currentProviderCount={order.provider_required}
                    ref={changeRequiredProviderCountRef}
                />
            )}
            <RightNowActivityOrderCancelModal
                lng={lng}
                rightNowActivityID={orderID}
                description={t("rightNowActivityOrderRecruitmentDetail.cancel.description")}
                isShowCancelAcceptedOrderConfirm={true}
                confirmText={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox")}
                confirmTextDescription={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox-description", { hour: 24, price: 20 })}
                ref={cancelOrderModalRef}
            />
        </div>
    );
}
