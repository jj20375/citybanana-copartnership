"use client";
import { memo, useState, useRef, useMemo, useEffect } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import RightNowActivityOrderSignUpCard from "./RightNowActivityOrderProviderSignupCard";
import type { RightNowActivityOrderDetailProviderSigupCardInterface, RightNowActivityOrderProviderCommentInterface } from "../rightnowactivity-order-interface";
import { Checkbox, GetProp, Radio, type RadioChangeEvent } from "antd";
// 選擇服務商幻燈片彈窗
import RightNowActivityOrderProviderCarouselModal from "./RightNowActivityOrderProviderCarouselModal";
// 確認付款彈窗
import RightNowActivityOrderConfirmPaymentModal from "./RightNowActivityOrderConfirmPaymentModal";
import { rightNowActivityOrderEnrollersStatusEnum } from "@/status-enum/rightnowactivity-order-enum";
import Image from "next/image";
import styles from "../styles/RightNowActivityOrderRecruitmentLogoAnimation.module.scss";
import { tmc } from "@/service/utils";
import { useAppSelector, useAppDispatch } from "@/store-toolkit/storeToolkit";
import { setChooseProviders } from "@/store-toolkit/stores/orderStore";
/**
 * 服務商申請加入即刻快閃活動區塊 ui
 */
const RightNowActivityOrderProviderSignUp = memo(
    ({ lng, orderID, providers, checkedProviders, providerRequiredCount, paymentMethod }: { lng: string; orderID: string; providers: RightNowActivityOrderDetailProviderSigupCardInterface[]; checkedProviders: number; providerRequiredCount: number; paymentMethod: string }) => {
        const { t } = useTranslation(lng, "main");

        const dispatch = useAppDispatch();
        const chooseProviders = useAppSelector((state) => state.orderStore.chooseProviders);

        // 選擇服務商彈窗 dom
        const chooseProviderCarouseModalRef = useRef<any>();

        // 開啟選擇服務商幻燈片彈窗
        const openProviderCarouselModal = () => {
            chooseProviderCarouseModalRef.current.openModal();
        };

        // 付款彈窗 dom
        const paymentConfirmModalRef = useRef<any>(null);
        // 開啟付款彈窗
        const openPaymentConfirmModal = () => {
            paymentConfirmModalRef.current.openModal();
        };

        // 已接受報名服務商
        const [acceptProviders, setAcceptPrviders] = useState<RightNowActivityOrderDetailProviderSigupCardInterface[]>();
        // 未選擇報名服務商
        const [unchooseProviders, setUnchooseProviders] = useState<RightNowActivityOrderDetailProviderSigupCardInterface[]>();
        // 被拒絕的服務商
        const [rejectedProviders, setRejectedPrviders] = useState<RightNowActivityOrderDetailProviderSigupCardInterface[]>();
        useEffect(() => {
            if (Array.isArray(providers)) {
                // 取得已接受報名服務商資料
                const accept = providers.filter((item) => item.enrollerStatus === rightNowActivityOrderEnrollersStatusEnum.Confirmed);
                setAcceptPrviders(accept);
                // 取得未接受報名服務商資料
                const unchoose = providers.filter((item) => item.enrollerStatus === rightNowActivityOrderEnrollersStatusEnum.UnConfirmed);
                setUnchooseProviders(unchoose);
                // 取得被拒絕的服務商資料
                const rejected = providers.filter((item) => item.enrollerStatus === rightNowActivityOrderEnrollersStatusEnum.Rejected);
                setRejectedPrviders(rejected);
            }
        }, [providers]);

        const disabledChooseButton = useMemo(() => {
            return chooseProviders.length === 0;
        }, [chooseProviders]);

        // 判斷是否為現金付款
        const isCashPay = useMemo(() => {
            if (paymentMethod === "cash") {
                return true;
            }
            return false;
        }, [paymentMethod]);

        return (
            <>
                {/* 已接受服務商列表  */}
                {Array.isArray(acceptProviders) && acceptProviders.length > 0 && (
                    <div className="mb-5">
                        <h5 className="text-lg-content font-bold mb-2">{t("rightNowActivityOrderDetail.confirmed-acceptProviders", { val: checkedProviders })}</h5>
                        {acceptProviders.map((data, index) => (
                            <RightNowActivityOrderSignUpCard
                                key={data.id + "-" + "checkedProviders"}
                                customClass={`${index !== acceptProviders.length - 1 && "mb-[15px]"}`}
                                lng={lng}
                                isCashPay={isCashPay}
                                providerCardData={data}
                                openProviderCarouselModal={openProviderCarouselModal}
                            />
                        ))}
                    </div>
                )}
                {/* 未選擇服務商列表  */}
                <div>
                    {Array.isArray(unchooseProviders) && (
                        <>
                            <h5 className="text-lg-content font-bold mb-2">{t("rightNowActivityOrderDetail.unchoose-providers", { val: unchooseProviders.length })}</h5>

                            {unchooseProviders.map((data, index) => (
                                <div key={data.id + "-" + "more1"}>
                                    <RightNowActivityOrderSignUpCard
                                        customClass={`${index !== unchooseProviders.length - 1 && "mb-[15px]"}`}
                                        lng={lng}
                                        isCashPay={isCashPay}
                                        providerCardData={data}
                                        openProviderCarouselModal={openProviderCarouselModal}
                                    />
                                </div>
                            ))}
                            <RightNowActivityOrderProviderCarouselModal
                                ref={chooseProviderCarouseModalRef}
                                lng={lng}
                                providers={unchooseProviders}
                            />
                        </>
                    )}
                </div>
                {/* 被婉拒服務商列表  */}
                {Array.isArray(rejectedProviders) && rejectedProviders.length > 0 && (
                    <>
                        <div className="mb-5">
                            {rejectedProviders.map((data, index) => (
                                <div
                                    key={data.id + "-" + "rejectedProviders"}
                                    onClick={openProviderCarouselModal}
                                    className="cursor-pointer"
                                >
                                    <RightNowActivityOrderSignUpCard
                                        customClass={`${index !== rejectedProviders.length - 1 && "mb-[15px]"}`}
                                        lng={lng}
                                        isCashPay={isCashPay}
                                        providerCardData={data}
                                        openProviderCarouselModal={openProviderCarouselModal}
                                    />
                                </div>
                            ))}
                        </div>
                        <RightNowActivityOrderProviderCarouselModal
                            ref={chooseProviderCarouseModalRef}
                            lng={lng}
                            providers={rejectedProviders}
                        />
                    </>
                )}

                <div className="flex items-center justify-center mt-[24px]">
                    <Image
                        src="/img/rightNowActivity/waiting-provider-signup.png"
                        width={30}
                        height={30}
                        style={{ width: "30px", height: "auto" }}
                        alt="Waiting provider signup"
                        className={tmc(["mr-2", styles.spin])}
                    />
                    <p className="font-bold text-gray-primary text-lg-content">{t("rightNowActivityOrderRecruitmentDetail.recruitment.waitingForOtherProviderSignup")}</p>
                </div>
                <div
                    className="my-[15px]"
                    onClick={openPaymentConfirmModal}
                >
                    <button
                        className="PrimaryGradient h-[45px] w-full rounded-md text-white DisabledGradient"
                        disabled={disabledChooseButton}
                    >
                        {t("global.choose")}
                    </button>
                </div>
                <RightNowActivityOrderConfirmPaymentModal
                    ref={paymentConfirmModalRef}
                    lng={lng}
                    providers={providers}
                    orderID={orderID}
                    paymentMethod={paymentMethod}
                />
            </>
        );
    }
);

export default RightNowActivityOrderProviderSignUp;
