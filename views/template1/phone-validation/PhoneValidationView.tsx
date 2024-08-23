"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
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
import { TWPhoneRegex, SmsValidateCodeRegex } from "@/config/regex.config";

export default function PhoneValidationView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");

    const router = useRouter();
    const title = t("phoneValidation.title");
    type FormValues = PhoneValidationInterface;
    const formSchema = {
        phone: formPhoneValiation({ requiredMessage: t("phoneValidation.phoneInput.validation.phone_requiredErrMessage"), matchMessage: t("phoneValidation.phoneInput.validation.phone_matchErrMessage") }),

        countryCode: yup.string().required(t("phoneValidation.phoneInput.validation.countryCode_requiredErrMessage")),
        validateCode: yup.string().required(t("phoneValidation.validateCode.validation.validateCode_requiredErrMessage")).matches(SmsValidateCodeRegex, t("phoneValidation.validateCode.validation.validateCode_matchesErrMessage")),
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
        clearErrors,
        reset,
        trigger,
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

    // 上一步按鈕事件
    const onPrevStepButtonClick = () => {
        reset();
        const origin = window.location.origin;
        const host = `${origin}/${lng}/create-rightnowactivity-order`;
        router.push(`${host}?${searchParams.toString()}`);
        return;
    };

    // 下一步按鈕事件
    const onNextStepButtonClick = () => {
        reset();
        const origin = window.location.origin;
        const host = `${origin}/${lng}/rightnowactivity-order-payment`;
        router.push(`${host}?${searchParams.toString()}`);

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

    /**
     * submit 成功時往下一步
     * @param data
     */
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("success form =>", data);
        if (Object.keys(errors).length > 0) {
            return;
        }
        onNextStepButtonClick();
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    const [disabled, setDisabled] = useState(false);

    // 手動觸發表單驗證
    const handleManualValidation = async () => {
        const result = await trigger();
        if (result) {
            console.log("Validation passed");
        } else {
            console.log("Validation failed");
        }
    };

    useEffect(() => {
        if (!TWPhoneRegex.test(phoneValue) || !SmsValidateCodeRegex.test(validateCodeValue)) {
            if (phoneValue.length > 0 && validateCodeValue.length > 0) {
                handleManualValidation();
            }
            setDisabled(true);
            return;
        }
        clearErrors();
        setDisabled(false);
    }, [phoneValue, validateCodeValue]);

    return (
        <>
            <TitleCompoent title={title} />
            <div className="mx-auto max-w-[400px] mt-[40px]">
                <label className="block mb-[15px] text-gray-primary text-lg-content">
                    {t("phoneValidation.phoneInput.label")} <span className="text-primary">*</span>
                </label>
                <form onSubmit={handleSubmit(onSubmit, onError)}>
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
                    {errors.form?.phone && <p className="text-red-600 OpenSans">{errors.form?.phone.message}</p>}
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
                    {errors.form?.validateCode && <p className="text-red-600 OpenSans">{errors.form?.validateCode.message}</p>}
                    <div className="mt-[40px] flex justify-center">
                        <ReCAPTCHA
                            sitekey={recaptcha2Key}
                            onChange={onRecaptchaChange}
                        />
                    </div>
                    <div>
                        <p className="text-center">測試倒數計時按鈕</p>
                        <div className="flex justify-center">
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
                    </div>
                    <div className="mt-[40px] w-full">
                        <div className="flex  max-w-[400px] w-full">
                            <div className="flex-1">
                                <ButtonBorderGradient
                                    onClick={onPrevStepButtonClick}
                                    buttonText={t("global.prevStep")}
                                    outsideClassName={`PrimaryGradient p-px rounded-md w-full`}
                                    insideClassName={`rounded-[calc(0.5rem-3px)] p-2  w-full flex items-center text-primary bg-white justify-center h-[45px]`}
                                    isDisabled={false}
                                    buttonType="button"
                                />
                            </div>
                            <div className="ml-5 flex-1">
                                <ButtonBorderGradient
                                    onClick={handleSubmit(onSubmit, onError)}
                                    buttonText={t("global.nextStep")}
                                    outsideClassName={`${!disabled ? "PrimaryGradient" : "DisabledGradientByOutlineBtn"}  p-px rounded-md w-full`}
                                    insideClassName={`${!disabled ? "PrimaryGradient" : "DisabledGradientByOutlineBtn"} rounded-[calc(0.5rem-3px)] p-2 w-full flex items-center justify-center text-white h-[45px]`}
                                    isDisabled={disabled}
                                    buttonType="submit"
                                />
                            </div>
                        </div>
                        <ContactWe lng={lng} />
                    </div>
                </form>
            </div>
            <pre>{JSON.stringify(form, null, 4)}</pre>
        </>
    );
}
