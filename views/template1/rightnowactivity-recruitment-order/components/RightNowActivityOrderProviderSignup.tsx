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
import { rightNowActivityOrderEnrollersStatusEnum, rightNowActivityOrderStatusByMemberEnum } from "@/status-enum/rightnowactivity-order-enum";
import Image from "next/image";
import styles from "../styles/RightNowActivityOrderRecruitmentLogoAnimation.module.scss";
import { tmc } from "@/service/utils";
import { useAppSelector, useAppDispatch } from "@/store-toolkit/storeToolkit";
import { setChooseProviders } from "@/store-toolkit/stores/orderStore";
import { OrderDetailViewReqInterface } from "../../order/order-detail-interface";
/**
 * 服務商申請加入即刻快閃活動區塊 ui
 */
const RightNowActivityOrderProviderSignUp = memo(
    ({
        lng,
        orderID,
        orderStatus,
        providers,
        checkedProviders, // 已付款選擇服務商數量
        providerRequiredCount, // 需求服務商數量
        paymentMethod,
    }: {
        lng: string;
        orderID: string;
        orderStatus: number;
        providers: RightNowActivityOrderDetailProviderSigupCardInterface[];
        checkedProviders: number;
        providerRequiredCount: number;
        paymentMethod: string;
    }) => {
        const { t } = useTranslation(lng, "main");

        // 服務方報名卡片 dom
        const signupCardRef = useRef<any>();

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
        // 已選擇服務商
        const [virtualChooseProviders, setVirtualChooseProviders] = useState<RightNowActivityOrderDetailProviderSigupCardInterface[]>([]);
        /**
         * 只處理現金付款選人時情況
         */
        useEffect(() => {
            // 取得已接受報名服務商資料
            const accept = providers.filter((item) => item.enrollerStatus === rightNowActivityOrderEnrollersStatusEnum.Confirmed);
            // 取得未接受報名服務商資料
            const unchoose = providers.filter((item) => item.enrollerStatus === rightNowActivityOrderEnrollersStatusEnum.UnConfirmed);
            // 取得被拒絕的服務商資料
            const rejected = providers.filter((item) => item.enrollerStatus === rightNowActivityOrderEnrollersStatusEnum.Rejected);
            // 只有現金付款時觸發
            if (Array.isArray(providers) && paymentMethod === "cash") {
                setAcceptPrviders(accept);
                setUnchooseProviders(unchoose);
                setRejectedPrviders(rejected);
                return;
            }
            // 非現金單只在非報名狀態時觸發
            if (paymentMethod !== "cash" && orderStatus !== rightNowActivityOrderStatusByMemberEnum.Pending) {
                setAcceptPrviders(accept);
                setUnchooseProviders(unchoose);
                setRejectedPrviders(rejected);
                return;
            }
        }, [providers, paymentMethod, orderStatus]);

        /**
         * 只處理非現金付款時選人時情況
         * 此機制只在報名狀態時觸發 且 是非現金單情況
         * 因為需要模擬 『預先選擇服務商列表』 以及『未選擇服務商列表』
         * 現金單情況使用者狀態 會立即被資料庫更新為以選中
         */
        useEffect(() => {
            // 報名服務商列表非陣列時 不觸發
            if (!Array.isArray(providers)) {
                return;
            }
            // 等於現金付款時不觸發 因為現金付款時 服務商報名狀態都會被即時更新在資料庫
            if (paymentMethod === "cash") {
                return;
            }

            // 取得已接受報名服務商資料
            const accept = providers.filter((item) => item.enrollerStatus === rightNowActivityOrderEnrollersStatusEnum.Confirmed);
            // 取得未接受報名服務商資料
            const unchoose = providers.filter((item) => item.enrollerStatus === rightNowActivityOrderEnrollersStatusEnum.UnConfirmed);
            // 取得被拒絕的服務商資料
            const rejected = providers.filter((item) => item.enrollerStatus === rightNowActivityOrderEnrollersStatusEnum.Rejected);
            // 不等於報名狀態時 不觸發 且 未選中服務商等於報名服務商數量時 代表沒有任何人被選中或被婉拒
            if (unchoose.length === providers.length) {
                setUnchooseProviders(unchoose);
            }
            // 判斷選中的服務商數量大於 0 時觸發 且為報名狀態時才觸發
            if (chooseProviders.length > 0 && Array.isArray(providers) && orderStatus === rightNowActivityOrderStatusByMemberEnum.Pending) {
                // 虛擬選擇狀態 因為非現金單會是全部選擇完才開單
                const virtualChooseProviders = providers.filter((item) => chooseProviders.some((chooseID) => chooseID === item.id));
                setVirtualChooseProviders(virtualChooseProviders);
                // 虛擬非選擇狀態 因為非現金單會是全部選擇完才開單
                const virtualUnChooseProviders = providers.filter((item) => chooseProviders.some((chooseID) => chooseID !== item.id));
                setUnchooseProviders(virtualUnChooseProviders);
                console.log("virtualChooseProviders =>", virtualChooseProviders.length, virtualUnChooseProviders.length, providers.length);
            }
        }, [chooseProviders, orderStatus, paymentMethod]);

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

        // 選擇服務商-非現金支付方式 (呼叫子組件)
        const chooseProviderByOtherPayMethod = (providerID: string) => {
            if (signupCardRef) {
                signupCardRef.current.onOtherPayMethodChooseProivder(providerID);
            }
        };
        // 非現金付款選擇服務商按鈕事件
        const RenderChooseProviderButtonByOtherPayment = (proderID: string) => (
            <button
                onClick={() => chooseProviderByOtherPayMethod(proderID)}
                className="bg-primary text-white rounded w-[78px] h-[25px] ml-2"
            >
                {t("global.choose")}
            </button>
        );

        // 取消選擇服務商-非現金支付方式 (呼叫子組件)
        const unchooseProviderByOtherPayMethod = (providerID: string) => {
            if (signupCardRef) {
                signupCardRef.current.onOtherPayMethodUnchooseProivder(providerID);
            }
        };
        // 非現金付款取消選擇服務商按鈕事件
        const RenderUnchooseProviderButtonByOtherPayment = (proderID: string) => (
            <button
                onClick={() => unchooseProviderByOtherPayMethod(proderID)}
                className="border-primary border text-primary rounded w-[78px] h-[25px] ml-2"
            >
                {t("global.cancelChoose")}
            </button>
        );

        // 選擇服務商-現金支付方式 (呼叫子組件)
        const chooseProviderByCashPayMethod = (providerID: string) => {
            if (signupCardRef) {
                signupCardRef.current.onCashPayMethodChooseProivder(providerID);
            }
        };
        // 現金付款選擇服務商按鈕事件
        const RenderChooseProviderButtonByCashPayment = (proderID: string) => (
            <button
                onClick={() => chooseProviderByCashPayMethod(proderID)}
                className="bg-primary text-white rounded w-[78px] h-[25px] ml-2"
            >
                {t("global.choose")}
            </button>
        );

        /**
         * 查看訂單事件 (呼叫子組件)
         * @param rightNowActivityID 即刻快閃單 id
         * @param providerID: 服務商 banana_id
         */
        const viewOrderMethod = ({ rightNowActivityID, providerID }: OrderDetailViewReqInterface) => {
            if (signupCardRef) {
                signupCardRef.current.onViewOrder({ rightNowActivityID, providerID });
            }
        };
        // 查看訂單按鈕事件
        const RenderViewOrderButton = ({ rightNowActivityID, providerID }: OrderDetailViewReqInterface) => (
            <button
                onClick={() => viewOrderMethod({ rightNowActivityID, providerID })}
                className="text-primary ml-2"
            >
                {t("global.viewOrder")}
            </button>
        );

        return (
            <>
                {/* 已選擇服務商列表(虛擬選擇 還沒走到真正付款選擇 只有非現金付款才會出現)  */}
                {Array.isArray(virtualChooseProviders) && virtualChooseProviders.length > 0 && (
                    <div className="mb-5">
                        <h5 className="text-lg-content font-bold mb-2">
                            <span className="text-primary">{virtualChooseProviders.length}</span>
                            {t("rightNowActivityOrderDetail.confirmed-virtualChooseProviders")}
                        </h5>
                        {virtualChooseProviders.map((data, index) => (
                            <RightNowActivityOrderSignUpCard
                                key={data.id + "-" + "checkedProviders"}
                                customClass={`${index !== virtualChooseProviders.length - 1 && "mb-[15px]"}`}
                                lng={lng}
                                isCashPay={isCashPay}
                                providerCardData={data}
                                openProviderCarouselModal={openProviderCarouselModal}
                                renderButton={RenderUnchooseProviderButtonByOtherPayment(data.id)}
                                ref={signupCardRef}
                            />
                        ))}
                    </div>
                )}
                {/* 已接受服務商列表(付款完成)  */}
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
                                renderButton={RenderViewOrderButton({ rightNowActivityID: data.orderID!, providerID: data.providerID! })}
                                ref={signupCardRef}
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
                                    {paymentMethod === "cash" ? (
                                        <RightNowActivityOrderSignUpCard
                                            customClass={`${index !== unchooseProviders.length - 1 && "mb-[15px]"}`}
                                            lng={lng}
                                            isCashPay={isCashPay}
                                            providerCardData={data}
                                            openProviderCarouselModal={openProviderCarouselModal}
                                            renderButton={RenderChooseProviderButtonByCashPayment(data.id)}
                                            ref={signupCardRef}
                                        />
                                    ) : (
                                        <RightNowActivityOrderSignUpCard
                                            customClass={`${index !== unchooseProviders.length - 1 && "mb-[15px]"}`}
                                            lng={lng}
                                            isCashPay={isCashPay}
                                            providerCardData={data}
                                            openProviderCarouselModal={openProviderCarouselModal}
                                            renderButton={RenderChooseProviderButtonByOtherPayment(data.id)}
                                            ref={signupCardRef}
                                        />
                                    )}
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
                                        renderButton={RenderViewOrderButton({ rightNowActivityID: data.orderID!, providerID: data.providerID! })}
                                        ref={signupCardRef}
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
