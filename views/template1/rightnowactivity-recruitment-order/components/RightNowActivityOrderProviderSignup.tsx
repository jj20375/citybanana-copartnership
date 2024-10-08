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
/**
 * 服務商申請加入即刻快閃活動區塊 ui
 */
const RightNowActivityOrderProviderSignUp = memo(
    ({
        lng,
        orderID,
        providers,
        checkedProviders,
        providerRequiredCount,
        comments,
        isSigleChoose,
        parentValues,
        setParentValues,
    }: {
        lng: string;
        orderID: string;
        providers: RightNowActivityOrderDetailProviderSigupCardInterface[];
        checkedProviders: number;
        providerRequiredCount: number;
        comments?: RightNowActivityOrderProviderCommentInterface[] | void;
        isSigleChoose: boolean;
        parentValues: string[];
        setParentValues: Function;
    }) => {
        const { t } = useTranslation(lng, "main");

        const [value, setValue] = useState(parentValues[0]);

        const onChange = (e: RadioChangeEvent) => {
            console.log("radio checked", e.target.value);
            setValue(e.target.value);
            setParentValues([e.target.value]);
        };

        const [values, setValues] = useState<string[]>(parentValues);
        const onChangeValues = (checkedValues: string[]) => {
            console.log("checked = ", checkedValues);
            setValues(checkedValues);
            setParentValues(checkedValues);
        };
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
            return (unchooseProviders && unchooseProviders.length === 0) || (values.length === 0 && value !== "") || (value === "" && values.length !== 0);
        }, [unchooseProviders, value, values]);

        return (
            <>
                {Array.isArray(acceptProviders) && acceptProviders.length > 0 && (
                    <div className="mb-5">
                        <h5 className="text-lg-content font-bold mb-2">{t("rightNowActivityOrderDetail.confirmed-acceptProviders", { val: checkedProviders })}</h5>
                        {acceptProviders.map((data, index) => (
                            <RightNowActivityOrderSignUpCard
                                key={data.id + "-" + "checkedProviders"}
                                customClass={`${index !== acceptProviders.length - 1 && "mb-[15px]"}`}
                                lng={lng}
                                providerCardData={data}
                            />
                        ))}
                    </div>
                )}
                {isSigleChoose ? (
                    <div>
                        {Array.isArray(unchooseProviders) && (
                            <>
                                <h5 className="text-lg-content font-bold mb-2">{t("rightNowActivityOrderDetail.unchoose-providers", { val: unchooseProviders.length })}</h5>
                                <Radio.Group
                                    onChange={onChange}
                                    value={value}
                                >
                                    {unchooseProviders.map((data, index) => (
                                        <Radio
                                            value={data.id}
                                            key={data.id + "-" + "single"}
                                        >
                                            <div
                                                onClick={openProviderCarouselModal}
                                                key={data.id + "-" + "single1"}
                                            >
                                                <RightNowActivityOrderSignUpCard
                                                    customClass={`${index !== unchooseProviders.length - 1 && "mb-[15px]"}`}
                                                    lng={lng}
                                                    providerCardData={data}
                                                />
                                            </div>
                                        </Radio>
                                    ))}
                                    <RightNowActivityOrderProviderCarouselModal
                                        ref={chooseProviderCarouseModalRef}
                                        lng={lng}
                                        providerIds={[value]}
                                        setProviderIds={setValue}
                                        providers={unchooseProviders}
                                        comments={comments}
                                    />
                                </Radio.Group>
                            </>
                        )}
                    </div>
                ) : (
                    <div>
                        {Array.isArray(unchooseProviders) && (
                            <>
                                <h5 className="text-lg-content font-bold mb-2">{t("rightNowActivityOrderDetail.unchoose-providers", { val: unchooseProviders.length })}</h5>
                                <Checkbox.Group
                                    style={{ width: "100%" }}
                                    value={values}
                                    onChange={onChangeValues}
                                >
                                    {unchooseProviders.map((data, index) => (
                                        <Checkbox
                                            value={data.id}
                                            key={data.id + "-" + "more"}
                                        >
                                            <div
                                                key={data.id + "-" + "more1"}
                                                onClick={openProviderCarouselModal}
                                            >
                                                <RightNowActivityOrderSignUpCard
                                                    customClass={`${index !== unchooseProviders.length - 1 && "mb-[15px]"}`}
                                                    lng={lng}
                                                    providerCardData={data}
                                                />
                                            </div>
                                        </Checkbox>
                                    ))}
                                    <RightNowActivityOrderProviderCarouselModal
                                        ref={chooseProviderCarouseModalRef}
                                        lng={lng}
                                        providerIds={values}
                                        setProviderIds={setValues}
                                        providers={unchooseProviders}
                                        comments={comments}
                                    />
                                </Checkbox.Group>
                            </>
                        )}
                    </div>
                )}
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
                                        providerCardData={data}
                                    />
                                </div>
                            ))}
                        </div>
                        <RightNowActivityOrderProviderCarouselModal
                            ref={chooseProviderCarouseModalRef}
                            lng={lng}
                            providerIds={values}
                            setProviderIds={setValues}
                            providers={rejectedProviders}
                            comments={comments}
                        />
                    </>
                )}
                <div className="flex justify-center text-[15px] mt-[30px]">
                    <p className="mr-2 text-gray-primary">{t("rightNowActivityOrderRecruitmentDetail.recruitment.needRequiredProviderCount", { val: providerRequiredCount })},</p>
                    <p className="text-gray-primary">
                        {t("rightNowActivityOrderRecruitmentDetail.recruitment.confirmed")}
                        <span className="mx-2 text-primary">{checkedProviders}</span>
                        {t("global.people")}
                    </p>
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
                    providerIds={isSigleChoose ? [value] : values}
                    orderID={orderID}
                />
            </>
        );
    }
);

export default RightNowActivityOrderProviderSignUp;
