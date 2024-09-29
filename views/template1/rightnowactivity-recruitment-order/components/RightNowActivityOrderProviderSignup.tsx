"use client";
import { memo, useState, useRef } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import RightNowActivityOrderSignUpCard from "./RightNowActivityOrderProviderSignupCard";
import type { RightNowActivityOrderDetailProviderSigupCardInterface, RightNowActivityOrderProviderCommentInterface } from "../rightnowactivity-order-interface";
import { Checkbox, GetProp, Radio, type RadioChangeEvent } from "antd";
// 選擇服務商幻燈片彈窗
import RightNowActivityOrderProviderCarouselModal from "./RightNowActivityOrderProviderCarouselModal";
// 確認付款彈窗
import RightNowActivityOrderConfirmPaymentModal from "./RightNowActivityOrderConfirmPaymentModal";
/**
 * 服務商申請加入即刻快閃活動區塊 ui
 */
const RightNowActivityOrderProviderSignUp = memo(
    ({
        lng,
        orderID,
        providers,
        comments,
        isSigleChoose,
        parentValues,
        setParentValues,
    }: {
        lng: string;
        orderID: string;
        providers: RightNowActivityOrderDetailProviderSigupCardInterface[];
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

        return (
            <>
                {isSigleChoose ? (
                    <Radio.Group
                        onChange={onChange}
                        value={value}
                    >
                        {providers.map((data, index) => (
                            <Radio
                                value={data.id}
                                key={data.id + "-" + "single"}
                            >
                                <div
                                    onClick={openProviderCarouselModal}
                                    key={data.id + "-" + "single1"}
                                >
                                    <RightNowActivityOrderSignUpCard
                                        customClass={`${index !== providers.length - 1 && "mb-[15px]"}`}
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
                            providers={providers}
                            comments={comments}
                        />
                    </Radio.Group>
                ) : (
                    <Checkbox.Group
                        style={{ width: "100%" }}
                        value={values}
                        onChange={onChangeValues}
                    >
                        {providers.map((data, index) => (
                            <Checkbox
                                value={data.id}
                                key={data.id + "-" + "more"}
                            >
                                <div
                                    key={data.id + "-" + "more1"}
                                    onClick={openProviderCarouselModal}
                                >
                                    <RightNowActivityOrderSignUpCard
                                        customClass={`${index !== providers.length - 1 && "mb-[15px]"}`}
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
                            providers={providers}
                            comments={comments}
                        />
                    </Checkbox.Group>
                )}

                <div className="flex justify-center text-[15px] mt-[30px]">
                    <p className="mr-2 text-gray-primary">{t("rightNowActivityOrderRecruitmentDetail.recruitment.needRequiredProviderCount", { val: 5 })},</p>
                    <p className="text-gray-primary">
                        {t("rightNowActivityOrderRecruitmentDetail.recruitment.confirmed")}
                        <span className="mx-2 text-primary">2</span>
                        {t("global.people")}
                    </p>
                </div>
                <div
                    className="my-[15px]"
                    onClick={openPaymentConfirmModal}
                >
                    <button className="PrimaryGradient h-[45px] w-full rounded-md text-white">{t("global.choose")}</button>
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
