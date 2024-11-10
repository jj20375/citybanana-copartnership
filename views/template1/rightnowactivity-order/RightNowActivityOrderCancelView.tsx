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
import type { GetRightNowActivityOrderDetailAPIResInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
import { GetRightNowActivityOrderDetailAPI } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { getPartnerStoreInfo, usePartnerStoreNameSelector } from "@/store-toolkit/stores/partnerStore";
import dayjs from "dayjs";
import RightNowActivityOrderByProviderContent from "./components/RightNowActivityOrderByProviderContent";
import { GetPartnerStoreInfoAPIResInterface } from "@/api/partnerStoreAPI/partnerStoreAPI-interface";

/**
 * 即刻快閃訂單取消詳細資料
 * @param param0
 * @returns
 */
export default function RightNowActivityOrderCancelDetailView({ lng, orderID }: { lng: string; orderID: string }) {
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

    // 重新下訂按鈕事件
    const handleReCreate = () => {
        return router.push("/create-rightnowactivity-order");
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
    const getOrder = useCallback(async (data: string) => {
        try {
            const res = await GetRightNowActivityOrderDetailAPI({ orderID: data });
            setOrder(res);

            if (Array.isArray(res.enrollers) && res.enrollers.length > 0) {
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
            console.log("GetRightNowActivityOrderDetailAPI => ", res);
            return res;
        } catch (err) {
            console.log("GetRightNowActivityOrderDetailAPI err => ", err);
            throw err;
        }
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const [fetchOrder] = await Promise.all([getOrder(orderID)]);
            const [fetchStore] = await Promise.all([getPartnerStore({ merchantCode: fetchOrder!.details.merchant.merchant_code, venueCode: fetchOrder!.details.merchant.venue_code })]);
            if (fetchOrder && fetchStore) {
                setDisplayOrder({
                    datas: [
                        // 店家資料
                        { label: t("rightNowActivityOrderRecruitmentDetail.column-store"), value: partnerStoreName, column: "column-store" },
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

    // 倒數計時秒數
    const [seconds, setSeconds] = useState(5);
    // 判斷是否觸發倒數計時
    const [isCounting, setIsCounting] = useState(false);

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
            <button
                type="button"
                className="w-full mt-[15px] text-primary border rounded-md h-[45px] border-primary mr-[13px]"
                onClick={handleReCreate}
            >
                {t("rightNowActivityOrderCancel.button-recreate") + ` (${seconds})`}
            </button>
        </div>
    );

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
            {displayOrder && acceptProviders && order ? (
                <RightNowActivityOrderDetail
                    lng={lng}
                    labelText={t("orderDetail.paymentAmount")}
                    renderTitle={RenderTitle()}
                    renderContent={RenderContent({ providers: acceptProviders, orderData: order })}
                    renderButton={RenderButton()}
                    providers={acceptProviders}
                    displayOrder={displayOrder}
                    orderData={order}
                />
            ) : null}
            <ContactWe lng={lng} />
        </div>
    );
}
