"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import RightNowActivityOrderDetail from "../components/RightNowActivityOrderDetail";
import { Icon } from "@iconify/react";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "@/views/template1/rightnowactivity-recruitment-order/rightnowactivity-order-interface";
// 聯絡我們 ui
import ContactWe from "../components/ContactWe";
import Image from "next/image";
import ButtonBorderGradient from "../components/ButtonBorderGradient";
import { OrderUndoCancelAPI } from "@/api/bookingAPI/bookingAPI";
import { Spin } from "antd";
import type { GetRightNowActivityOrderDetailAPIResInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
import { rightNowActivityOrderStatusByMemberEnum } from "@/status-enum/rightnowactivity-order-enum";
import { GetRightNowActivityOrderDetailAPI } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { getPartnerStoreInfo, usePartnerStoreNameSelector } from "@/store-toolkit/stores/partnerStore";
import { message as messagePop } from "antd";
import { showApiErrorMethod } from "@/service/utils";
import dayjs from "dayjs";
import { GetPartnerStoreInfoAPIResInterface } from "@/api/partnerStoreAPI/partnerStoreAPI-interface";

/**
 * 一般訂單取消詳細資料
 * @param param0
 * @returns
 */
export default function OrderCancelDetailView({ lng, providerID, rightNowActivityID }: { lng: string; providerID: string; rightNowActivityID: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    // 合作店家資料
    const partnerStore = useAppSelector((state) => state.partnerStore);
    // 合作店家名稱
    const partnerStoreName = usePartnerStoreNameSelector(partnerStore);
    // 錯誤語系檔資料
    const errorMessageLang = useAppSelector((state) => state.utilityStore.errorMessageLang);

    type DisplayOrder = {
        datas: {
            label: string;
            value: string;
            column: string;
        }[];
    };

    const [seconds, setSeconds] = useState(5);
    // 判斷是否觸發倒數計時
    const [isCounting, setIsCounting] = useState(false);

    const timerRef = useRef<any>(null);

    const [order, setOrder] = useState<GetRightNowActivityOrderDetailAPIResInterface>();
    // 顯示訂單資料
    const [displayOrder, setDisplayOrder] = useState<DisplayOrder>();
    // 顯示取消活動按鈕
    const [isShowCancelButton, setIsShowCancelButton] = useState(true);

    const [provider, setProvider] = useState<RightNowActivityOrderDetailProviderSigupCardInterface>();

    // 重新下訂按鈕事件
    const handleReCreate = () => {
        return router.push("/create-rightnowactivity-order");
    };

    /**
     * 反悔取消訂單機制
     */
    const ordcerUndoCancel = async ({ providerID, orderID, rightNowActivityID }: { providerID: string; orderID: string; rightNowActivityID: string }) => {
        try {
            await OrderUndoCancelAPI(orderID);
            router.push(`/order/${providerID}/${rightNowActivityID}`);
        } catch (err: any) {
            showApiErrorMethod({
                apiErr: err,
                errorMessageLang,
                lng: lng === "zh-TW" ? "tw" : "en",
                globalErrMessage: t("global.apiError"),
            });
            throw err;
        }
    };

    // 不小按錯按鈕事件
    const onSubmit = async () => {
        if (provider && provider.orderID) {
            await ordcerUndoCancel({ providerID, rightNowActivityID: rightNowActivityID, orderID: provider.orderID });
        }
    };

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
            <div className="w-full">
                <Spin spinning={loading}>
                    <ButtonBorderGradient
                        onClick={handleReCreate}
                        buttonText={t("rightNowActivityOrderCancel.button-recreate") + ` (${seconds})`}
                        outsideClassName={`p-px rounded-md flex-1 ${!isCounting ? "DisabledGradient" : "PrimaryGradient"}`}
                        insideClassName={`rounded-[calc(0.5rem-3px)] p-2  w-full flex items-center text-white  bg-white justify-center h-[45px] ${!isCounting ? "DisabledGradientByOutlineBtn" : "PrimaryGradient"}`}
                        isDisabled={!isCounting}
                        buttonType="button"
                    />
                </Spin>
            </div>
            {/* <div className="w-full">
                <Spin spinning={loading}>
                    <button
                        type="button"
                        className="w-full mt-[15px] text-primary border rounded-md h-[45px] border-primary mr-[13px]"
                        onClick={handleReCreate}
                    >
                        {t("rightNowActivityOrderCancel.button-recreate")}
                    </button>
                </Spin>
            </div> */}
        </div>
    );

    const RenderContent = () => <div></div>;

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
                        console.log("order cancel =>", item.dating);
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
                            orderID: item.dating !== null && typeof item.dating === "object" ? item.dating.order_id : "",
                        };
                    })
                    .find((item) => item.providerID === providerID);
                if (setDatas !== undefined) {
                    setProvider(setDatas);
                }
            }
            console.log("GetRightNowActivityOrderDetailAPI => ", res);
            setIsCounting(true);
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

    useEffect(() => {
        if (isCounting) {
            timerRef.current = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds <= 1) {
                        clearInterval(timerRef.current);
                        setIsCounting(false);
                        handleReCreate();
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
            {displayOrder && provider && order ? (
                <RightNowActivityOrderDetail
                    lng={lng}
                    labelText={t("orderDetail.paymentAmount")}
                    renderTitle={RenderTitle()}
                    renderContent={RenderContent()}
                    renderButton={RenderButton()}
                    providers={[provider]}
                    displayOrder={displayOrder}
                    orderData={order}
                />
            ) : null}
            <ContactWe lng={lng} />
        </div>
    );
}
