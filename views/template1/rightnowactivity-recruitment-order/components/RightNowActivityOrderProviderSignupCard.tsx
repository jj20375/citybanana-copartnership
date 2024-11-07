"use client";
import React, { forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "../rightnowactivity-order-interface";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { setChooseProviders } from "@/store-toolkit/stores/orderStore";
import { useRouter } from "next/navigation";
import { OrderDetailViewReqInterface } from "../../order/order-detail-interface";

/**
 * 服務商報名即刻快閃活動 卡片 ui
 */
const RightNowActivityOrderSignUpCard = forwardRef(
    (
        {
            lng,
            providerCardData,
            isCashPay,
            customClass,
            openProviderCarouselModal,
            renderButton,
        }: {
            lng: string;
            providerCardData: RightNowActivityOrderDetailProviderSigupCardInterface;
            isCashPay: boolean;
            customClass?: string | void;
            openProviderCarouselModal: any;
            renderButton: React.ReactElement;
        },
        ref: any
    ) => {
        const { t } = useTranslation(lng, "main");
        const router = useRouter();

        const dispatch = useAppDispatch();
        const chooseProviders = useAppSelector((state) => state.orderStore.chooseProviders);

        const chooseProvider = (prodviderID: string) => {
            if (isCashPay) {
                return cashPayMethodChooseProvider(prodviderID);
            }
            return otherPayMethodChooseProvider(prodviderID);
        };

        /**
         * 使用現金付款方法選擇服務商按鈕事件
         * @param prodviderID
         * @returns
         */
        const cashPayMethodChooseProvider = (prodviderID: string) => {
            // 使用現金付款方式是選擇單筆服務商就做支付 因此不用過往把已選擇資料塞入
            dispatch(setChooseProviders([prodviderID]));
            return;
        };

        /**
         * 使用其他付款方式方法選擇服務商按鈕事件
         * @param prodviderID
         * @returns
         */
        const otherPayMethodChooseProvider = (prodviderID: string) => {
            dispatch(setChooseProviders([...chooseProviders, prodviderID]));
            return;
        };
        /**
         * 使用其他付款方式方法取消選擇服務商按鈕事件
         * @param prodviderID
         * @returns
         */
        const otherPayMethodUnchooseProvider = (prodviderID: string) => {
            const filterProviders = chooseProviders.filter((provider) => provider !== prodviderID);
            dispatch(setChooseProviders(filterProviders));
            return;
        };
        /**
         * 查看訂單
         * @param rightNowActivityID 即刻快閃單 id
         * @param providerID: 服務商 banana_id
         */
        const viewOrder = ({ rightNowActivityID, providerID }: OrderDetailViewReqInterface) => {
            router.push(`/order/${providerID}/${rightNowActivityID}`);
            return;
        };

        useImperativeHandle(ref, () => ({
            // 其他付款方式選擇服務商按鈕事件
            onOtherPayMethodChooseProivder: async (prodviderID: string) => {
                return otherPayMethodChooseProvider(prodviderID);
            },
            // 其他付款方式取消選擇服務商按鈕事件
            onOtherPayMethodUnchooseProivder: async (prodviderID: string) => {
                return otherPayMethodUnchooseProvider(prodviderID);
            },
            // 現金付款方式選擇服務商按鈕事件
            onCashPayMethodChooseProivder: async (prodviderID: string) => {
                return cashPayMethodChooseProvider(prodviderID);
            },
            // 查看訂單事件
            onViewOrder: ({ rightNowActivityID, providerID }: OrderDetailViewReqInterface) => {
                return viewOrder({ rightNowActivityID, providerID });
            },
        }));

        return (
            <div className={`${customClass} border border-gray-light rounded-md`}>
                <div className="flex">
                    <div
                        className="flex-1 relative"
                        onClick={openProviderCarouselModal}
                    >
                        <Image
                            className="rounded-tl-md rounded-bl-md object-cover w-full h-full"
                            src={providerCardData.cover}
                            width={300}
                            height={300}
                            alt="provider logo"
                        />
                        {providerCardData.isQueen && (
                            <div className="absolute bottom-2 left-2 shadow-md">
                                <Image
                                    src="/img/icons/queen.svg"
                                    width={100}
                                    height={100}
                                    style={{ width: "70px", height: "auto" }}
                                    alt="queen"
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 px-[10px] mt-2 flex-col flex">
                        <div className="mb-[8px]">
                            <h5 className="pr-5 text-lg-content font-bold text-gray-primary">{providerCardData.name}</h5>
                            {providerCardData.rate && (
                                <div className="flex items-start mt-2">
                                    <span className="pr-[2.5px]">
                                        <Image
                                            src="/img/icons/rate.svg"
                                            width={10}
                                            height={10}
                                            alt="rate"
                                            style={{ width: "10px", height: "auto" }}
                                        />
                                    </span>
                                    <span className="text-[12px] text-gray-primary font-bold leading-none">{providerCardData.rate}</span>
                                </div>
                            )}
                            {providerCardData.isNowTime ? (
                                <p className="line-clamp-3 text-xs-content text-gray-primary mt-[7px]">{t("rightNowActivityOrderRecruitmentDetail.recruitment.providerTravelTime", { val: providerCardData.travelTime ? providerCardData.travelTime : "" })}</p>
                            ) : (
                                <p className="line-clamp-3 text-xs-content text-gray-primary mt-[7px]">{providerCardData.description}</p>
                            )}
                        </div>
                        <div className="text-[10px] flex-grow-0 h-full flex items-end font-bold mb-2">
                            <div className="flex items-center">
                                <span className="text-primary">{t("rightNowActivityOrder.price", { val: providerCardData.price }) + t("global.moneyUnit")} </span>
                                <span className="mx-1">/</span>
                                <span>{t("global.priceUnit.hour")}</span>
                                {renderButton}
                                {/* <button
                                    onClick={() => chooseProivder(providerCardData.id)}
                                    className="bg-primary text-white rounded w-[78px] h-[25px] ml-2"
                                >
                                    {t("global.choose")}
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
export default RightNowActivityOrderSignUpCard;
