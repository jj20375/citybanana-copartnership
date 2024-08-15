"use client";
import { memo, useState, useRef } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import RightNowActivityOrderSignUpCard from "./RightNowActivityOrderProviderSignupCard";
import { RightNowActivityOrderDetailProviderSigupCard } from "../rightnowactivity-order-interface";
import { Checkbox, GetProp, Radio, type RadioChangeEvent } from "antd";
// 選擇服務商幻燈片彈窗
import RightNowActivityOrderProviderCarouselModal from "./RightNowActivityOrderProviderCarouselModal";
/**
 * 服務商申請加入即刻快閃活動區塊 ui
 */
const RightNowActivityOrderProviderSignUp = memo(({ lng, providers, isSigleChoose, parentValues, setParentValues }: { lng: string; providers: RightNowActivityOrderDetailProviderSigupCard[]; isSigleChoose: boolean; parentValues: string[]; setParentValues: Function }) => {
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
                    />
                </Checkbox.Group>
            )}

            <div className="flex justify-center text-[15px] mt-[30px]">
                <p className="mr-2 text-gray-primary">{t("rightNowActivityOrderDetail.recruitment.needRequiredProviderCount", { val: 5 })},</p>
                <p className="text-gray-primary">
                    {t("rightNowActivityOrderDetail.recruitment.confirmed")}
                    <span className="mx-2 text-primary">2</span>
                    {t("global.people")}
                </p>
            </div>
            <div className="my-[15px]">
                <button className="PrimaryGradient h-[45px] w-full rounded-md text-white">{t("global.choose")}</button>
            </div>
        </>
    );
});

export default RightNowActivityOrderProviderSignUp;
