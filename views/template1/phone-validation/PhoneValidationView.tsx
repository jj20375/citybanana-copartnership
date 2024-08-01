"use client";

import { useState, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { PhoneValidationInterface } from "./phone-validation-interface";
import { formPhoneValiation } from "@/service/form-validate";
import { useTranslation } from "@/i18n/i18n-client";
import PhoneInput from "./components/PhoneInput";
import PhoneSmsValidateCodeInput from "./components/PhoneSmsValidateCodeInput";
import CountdownButton from "@/views/template1/components/CountdownButton";
import ButtonBorderGradient from "@/views/template1/components/ButtonBorderGradient";
import TitleCompoent from "../components/TitleComponent";
import ContactWe from "@/views/template1/components/ContactWe";
import { useRouter, useSearchParams } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import dayjs from "dayjs";
import { isEmpty } from "@/service/utils";

export default function PhoneValidationView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");

    const router = useRouter();
    const title = t("phoneValidation.title");
    type FormValues = PhoneValidationInterface;
    const formSchema = {
        phone: formPhoneValiation({ requiredMessage: t("phoneValidation.phoneInput.validation.phone_requiredErrMessage"), matchMessage: t("phoneValidation.phoneInput.validation.phone_matchErrMessage") }),
        countryCode: yup.string().required(t("phoneValidation.phoneInput.validation.countryCode_requiredErrMessage")),
        validateCode: yup.string().required(t("valdateCode.validation.requiredErrMessage")),
    };

    const [schema, setSchema]: any = useState(
        yup
            .object()
            .shape({
                form: yup.object().shape(formSchema),
            })
            .required()
    );

    const {
        register,
        control,
        handleSubmit,
        watch,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            form: {
                phone: "",
                countryCode: "886",
                validateCode: "",
            },
        },
    });

    const phoneValue = watch("form.phone");
    const countryCodeValue = watch("form.countryCode");
    const validateCodeValue = watch("form.validateCode");
    const form = watch("form");

    const countdownButtonRef = useRef<any>();

    const startCountdown = () => {
        countdownButtonRef.current.startCountdown();
    };

    const cancelCountdown = () => {
        countdownButtonRef.current.cancelCountdown();
    };

    const searchParams: any = useSearchParams();

    //   // 显示键/值对
    // for (const [key, value] of searchParams?.entries()) {
    //     if (!isEmpty(value)) {
    //         console.log(key, value);
    //     }
    // }

    // 上一步按鈕事件
    const onPrevStepButtonClick = () => {
        const origin = window.location.origin;
        const host = `${origin}/${lng}/create-rightnowactivity-order`;

        router.push(`${host}?${searchParams.toString()}`);
        return;
    };

    // 下一步按鈕事件
    const onNextStepButtonClick = () => {
        return;
    };

    /**
     * recaptcha 驗證回調
     * @param val
     */
    const onRecaptchaChange = (val: any) => {
        console.log("onRecaptchaChange =>", val);
    };
    const recaptcha2Key = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA2_KEY;

    console.log("searchParams =>", dayjs(searchParams?.get("startTime")).format("YYYY-MM-DD HH:mm:ss"), searchParams?.toString());
    return (
        <>
            <TitleCompoent title={title} />
            <div className="mx-auto max-w-[400px] mt-[40px]">
                <label className="block mb-[15px] text-gray-primary text-lg-content">
                    {t("phoneValidation.phoneInput.label")} <span className="text-primary">*</span>
                </label>
                <PhoneInput
                    lng={lng}
                    parentCountryCode={countryCodeValue}
                    parentPhone={phoneValue}
                    phoneLabel="form.phone"
                    countryCodeLabel="form.countryCode"
                    setParentCountryCode={setValue}
                    setParentPhone={setValue}
                    register={register}
                />
                <div className="flex mt-[30px]">
                    <PhoneSmsValidateCodeInput
                        lng={lng}
                        label="form.validateCode"
                        value={validateCodeValue}
                        setValue={setValue}
                        register={register}
                        className="mr-5 flex-1"
                    />
                    <CountdownButton
                        initialSeconds={300}
                        buttonText={t("phoneValidation.validateCode.buttonText")}
                        className="text-base-content"
                        ref={countdownButtonRef}
                    />
                </div>
                <div className="mt-[40px]">
                    <ReCAPTCHA
                        sitekey={recaptcha2Key}
                        onChange={onRecaptchaChange}
                    />
                </div>
                <div className="flex">
                    <button
                        className="border p-2"
                        onClick={startCountdown}
                    >
                        Start Countdown
                    </button>
                    <button
                        className="border p-2"
                        onClick={cancelCountdown}
                    >
                        Cancel Countdown
                    </button>
                </div>
                <div className="fixed bottom-0 w-full">
                    <div className="flex absolute bottom-[105px] max-w-[400px] w-full">
                        <div className="flex-1">
                            <ButtonBorderGradient
                                onClick={onPrevStepButtonClick}
                                buttonText={t("global.prevStep")}
                                outsideClassName="PrimaryGradient p-px rounded-md w-full"
                                insideClassName="rounded-[calc(0.5rem-3px)] p-2 bg-white w-full flex items-center justify-center text-primary h-[45px]"
                            />
                        </div>
                        <div className="ml-5 flex-1">
                            <ButtonBorderGradient
                                onClick={onNextStepButtonClick}
                                buttonText={t("global.nextStep")}
                                outsideClassName="PrimaryGradient w-full p-px rounded-md"
                                insideClassName="rounded-[calc(0.5rem-3px)] p-2 w-full flex items-center justify-center text-white h-[45px] PrimaryGradient"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center w-full max-w-[400px]">
                        <div className="absolute bottom-[40px]">
                            <ContactWe lng={lng} />
                        </div>
                    </div>
                </div>
            </div>
            <pre>{JSON.stringify(form, null, 4)}</pre>
        </>
    );
}
