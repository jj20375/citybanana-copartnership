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
import Image from "next/image";
import type { GetRightNowActivityOrderDetailAPIResInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { getPartnerStoreInfo, usePartnerStoreNameSelector } from "@/store-toolkit/stores/partnerStore";
import { GetRightNowActivityOrderDetailAPI } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI";
import { canCancelRightNowActivityOrderStatusEnum, rightNowActivityOrderEnrollersStatusEnum, rightNowActivityOrderStatusByMemberEnum } from "@/status-enum/rightnowactivity-order-enum";
import dayjs from "dayjs";
import { GetPartnerStoreInfoAPIResInterface } from "@/api/partnerStoreAPI/partnerStoreAPI-interface";
import RightNowActivityOrderByProviderContent from "./components/RightNowActivityOrderByProviderContent";
import { tmc } from "@/service/utils";

/**
 * 即刻快閃訂單建立成功詳細資料
 * @param param0
 * @returns
 */
export default function OrderDetailView({ lng, orderID }: { lng: string; orderID: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();
    const dispatch = useAppDispatch();

    type DisplayOrder = {
        datas: {
            label: string;
            value: string;
            column: string;
        }[];
    };
    const [order, setOrder] = useState<GetRightNowActivityOrderDetailAPIResInterface>();
    // 合作店家資料
    const partnerStore = useAppSelector((state) => state.partnerStore);
    // 合作店家名稱
    const partnerStoreName = usePartnerStoreNameSelector(partnerStore);
    // 顯示訂單資料
    const [displayOrder, setDisplayOrder] = useState<DisplayOrder>();
    // 報名服務商
    const [providers, setProviders] = useState<RightNowActivityOrderDetailProviderSigupCardInterface[]>([]);
    // 已接受報名服務商
    const [acceptProviders, setAcceptPrviders] = useState<RightNowActivityOrderDetailProviderSigupCardInterface[]>();
    // 新增服務商人數彈窗 dom
    const changeRequiredProviderCountRef = useRef<any>();
    // 顯示取消活動按鈕
    const [isShowCancelButton, setIsShowCancelButton] = useState(true);
    // 判斷是否顯示連同已經確認的服務商一般訂單一起取消的選擇框
    const [isShowCancelAcceptedOrderConfirm, setIsShowCancelAcceptedOrderConfirm] = useState(false);

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

    const RenderTitle = (orderData: GetRightNowActivityOrderDetailAPIResInterface) => (
        <div className="mb-[40px] font-bold">
            <Image
                src="/img/icons/order-create-success.svg"
                alt="order create success"
                width={100}
                height={100}
                style={{ width: "80px", height: "auto" }}
                className="mx-auto"
            />
            {orderData.provider_accepted === orderData.provider_required ? (
                <h1 className="text-black w-full text-md-title text-center mt-[30px] whitespace-pre-wrap">{t("rightNowActivityOrderDetail.title-success-registrationFull")}</h1>
            ) : (
                <h1 className="text-black w-full text-md-title text-center mt-[30px]">{t("rightNowActivityOrderDetail.title-success")}</h1>
            )}
        </div>
    );

    const RenderButton = () => (
        <div className="flex flex-col">
            {isShowCancelButton && (
                <button
                    onClick={openChangeRequiredProviderCountModal}
                    className="border border-primary text-primary h-[45px] w-full mb-[15px] rounded"
                >
                    {t("rightNowActivityOrderRecruitmentDetail.button-addRequiredProviderCount")}
                </button>
            )}
            {isShowCancelButton && (
                <button
                    onClick={openCancelOrderModal}
                    className="border border-gray-third text-gray-third h-[45px] w-full rounded"
                >
                    {t("global.cancel-activity")}
                </button>
            )}
        </div>
    );

    const RenderContent = ({ providers, orderData }: { providers: RightNowActivityOrderDetailProviderSigupCardInterface[]; orderData: GetRightNowActivityOrderDetailAPIResInterface }) => {
        return Array.isArray(providers) && orderData ? (
            <div className={tmc(["grid gap-2 place-items-center", providers.length === 1 ? "grid-cols-1" : "grid-cols-3"])}>
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
            /**
             * 活動還沒開始狀態 0,1
             * 設定是否顯示取消訂單按鈕 當有服務商報名時 且訂單狀態等於 0 開放報名中 或 等於 1 報名額滿 時
             * 扔然可以讓他取消單是需連同一般預訂單一起取消 所以顯示取消活動按鈕
             */
            setIsShowCancelButton([canCancelRightNowActivityOrderStatusEnum.Pending, canCancelRightNowActivityOrderStatusEnum.RegistrationFull].includes(res.status));

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
                /**
                 * 判斷是否顯示已經確認的服務商在取消活動時
                 * 連同已確認的一般預訂單一起取消
                 * enrollers 裡面的 status = 1 代表已確認服務商
                 */
                setIsShowCancelAcceptedOrderConfirm(res.enrollers.some((item) => item.status === rightNowActivityOrderEnrollersStatusEnum.Confirmed));

                const setDatas: RightNowActivityOrderDetailProviderSigupCardInterface[] = res.enrollers.map((item) => {
                    const isQueen = Array.isArray(item.user!.badges) && item.user!.badges.length > 0 ? item.user!.badges.find((badge) => badge.id === 1) !== undefined : false;
                    console.log("item.user!.occupation =>", item.user!.occupation);
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
                        providerID: item.user!.banana_id,
                    };
                });
                setProviders(setDatas);
            }
            console.log("GetRightNowActivityOrderDetailAPI => ", res);
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
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-note"), value: fetchOrder.requirement === null ? "" : fetchOrder.requirement, column: "column-note" },
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
        fetchData();
    }, []);

    useEffect(() => {
        if (Array.isArray(providers)) {
            // 取得已接受報名服務商資料
            const accept = providers.filter((item) => item.enrollerStatus === 1);
            setAcceptPrviders(accept);
        }
    }, [providers]);

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
            {displayOrder && acceptProviders && order ? (
                <RightNowActivityOrderDetail
                    lng={lng}
                    labelText={t("orderDetail.paymentAmount")}
                    renderTitle={RenderTitle(order)}
                    renderContent={RenderContent({ providers: acceptProviders, orderData: order })}
                    renderButton={RenderButton()}
                    providers={acceptProviders}
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
                isShowCancelAcceptedOrderConfirm={isShowCancelAcceptedOrderConfirm}
                confirmText={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox")}
                confirmTextDescription={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox-description", { hour: 24, price: 20 })}
                ref={cancelOrderModalRef}
            />
        </div>
    );
}
