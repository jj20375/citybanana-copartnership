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
import Image from "next/image";
import type { GetRightNowActivityOrderDetailAPIResInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { usePartnerStoreNameSelector } from "@/store-toolkit/stores/partnerStore";
import { GetRightNowActivityOrderDetailAPI } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI";

/**
 * 即刻快閃訂單建立成功詳細資料
 * @param param0
 * @returns
 */
export default function OrderDetailView({ lng, orderID }: { lng: string; orderID: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

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

    const RenderTitle = () => (
        <div className=" mb-[40px] font-bold">
            <Image
                src="/img/icons/order-create-success.svg"
                alt="order create success"
                width={100}
                height={100}
                style={{ width: "50px", height: "auto" }}
                className="mx-auto"
            />
            <h1 className="text-black w-full text-md-title text-center mt-[30px]">{t("rightNowActivityOrderDetail.title-success")}</h1>
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
    /**
     * 取得訂單資料
     */
    const getOrder = useCallback(async (data: string) => {
        try {
            const res = await GetRightNowActivityOrderDetailAPI(data);
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
                const setDatas: RightNowActivityOrderDetailProviderSigupCardInterface[] = res.enrollers.map((item) => {
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
        } catch (err) {
            console.log("GetRightNowActivityOrderDetailAPI err => ", err);
            throw err;
        }
    }, []);

    useEffect(() => {
        getOrder(orderID);
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
                    renderTitle={RenderTitle()}
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
                isShowCancelAcceptedOrderConfirm={true}
                confirmText={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox")}
                confirmTextDescription={t("rightNowActivityOrderRecruitmentDetail.cancel.label-checkbox-description", { hour: 24, price: 20 })}
                ref={cancelOrderModalRef}
            />
            <ContactWe lng={lng} />
        </div>
    );
}
