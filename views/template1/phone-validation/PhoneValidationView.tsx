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
import type { GetVerificationCodeAPIReqInterface, VerificationSMSCodeAPIReqInterface } from "@/api/authAPI/authAPI-interface";
import { GetVerificationCodeAPI, VerificationSMSCodeAPI } from "@/api/authAPI/authAPI";
import { setToken } from "@/service/actions";
import { useAppDispatch } from "@/store-toolkit/storeToolkit";
import { getUserProfile } from "@/store-toolkit/stores/userStore";

export default function PhoneValidationView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();
    const dispatch = useAppDispatch();

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
    // 設定 recaptcha token
    const [recaptchaValue, setRecaptchaValue] = useState("");
    // 簡訊驗證時 驗證密鑰
    const [crumb, setCrumb] = useState("");

    // 清空表單資料
    const clearForm = () => {
        reset();
        setRecaptchaValue("");
        setCrumb("");
    };

    const countdownButtonRef = useRef<any>();
    const [countdownButtonDisabled, setCountdownButtonDisabled] = useState(false);

    // 當還有取得簡訊驗證碼時 驗證碼輸入匡為 disabled
    const [validateCodeInputDisabled, setValidateCodeInputDisabled] = useState(true);

    //開始倒數計時
    const startCountdown = async () => {
        countdownButtonRef.current.startCountdown();
        await getVerificationCode({
            country_code: countryCodeValue,
            phone: "0" + phoneValue,
            recaptchaToken: recaptchaValue,
        });
    };

    // 取消倒數計時
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

    const recaptcha2Key = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA2_KEY;

    /**
     * recaptcha 驗證回調
     * @param val
     */
    const onRecaptchaChange = (val: any) => {
        console.log("onRecaptchaChange =>", val);
        setRecaptchaValue(val);
    };
    /**
     * recaptcha 驗證失敗回調
     */
    const onRecaptchaError = (err: any) => {
        console.log("onRecaptchaError =>", err);
        setRecaptchaValue("");
        setCrumb("");
    };
    /**
     * recaptcha 驗證超時回調
     */
    const onRecaptchaExpired = (err: any) => {
        console.log("onRecaptchaExpired =>", err);
        setRecaptchaValue("");
        setCrumb("");
    };
    /**
     * submit 成功時往下一步
     * @param data
     */
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log("success form =>", data);
        if (recaptchaValue === "") {
            return;
        }
        if (Object.keys(errors).length > 0) {
            return;
        }
        // 驗證簡訊驗證碼
        await verificationSMSCode({
            country_code: countryCodeValue,
            phone: "0" + phoneValue,
            code: validateCodeValue,
            crumb: crumb,
        });
        dispatch(getUserProfile());
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

    /**
     * 發送驗證碼
     * @param form
     */
    const getVerificationCode = async (form: GetVerificationCodeAPIReqInterface) => {
        try {
            const data = await GetVerificationCodeAPI(form);
            setCrumb(data.crumb);
            // 設定簡訊驗證碼輸入匡為非 disabled狀態
            setValidateCodeInputDisabled(false);
            console.log("GetVerificationCodeAPI data =>", data);
        } catch (err) {
            console.log("GetVerificationCodeAPI err =>", err);
            throw err;
        }
    };

    /**
     * 驗證簡訊驗證碼
     */
    const verificationSMSCode = async (form: VerificationSMSCodeAPIReqInterface) => {
        try {
            const data = await VerificationSMSCodeAPI(form);
            clearForm();
            console.log("VerificationSMSCodeAPI data =>", data);
            setToken({
                token: data.access_token,
                expiresTime: data.expires_in,
            });
            // 因為簡訊驗證碼以驗證成功 再度將驗證碼輸入匡給為 disabled狀態
            setValidateCodeInputDisabled(true);
            // 設定是否為訪客身份(代表首次註冊)
            setIsVisitor(data.first_visit);
        } catch (err) {
            console.log("VerificationSMSCodeAPI err =>", err);
            throw err;
        }
    };

    useEffect(() => {
        if (!TWPhoneRegex.test(phoneValue) || !SmsValidateCodeRegex.test(validateCodeValue) || recaptchaValue === "") {
            if (phoneValue.length > 0 && validateCodeValue.length > 0) {
                handleManualValidation();
            }
            // 手機格式驗證失敗 不可以發送取得驗證碼
            if (!TWPhoneRegex.test(phoneValue) || recaptchaValue === "") {
                setCountdownButtonDisabled(true);
            }
            // 手機格式驗證成功 取消發送驗證碼按鈕 disabled
            if (TWPhoneRegex.test(phoneValue) && recaptchaValue.length > 0) {
                console.log("phoneValue =>", phoneValue);
                setCountdownButtonDisabled(false);
            }
            setDisabled(true);
            return;
        }

        clearErrors();
        setDisabled(false);
    }, [phoneValue, validateCodeValue, recaptchaValue]);

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
                            isDisabled={validateCodeInputDisabled}
                            className="mr-5 flex-1"
                        />
                        <div
                            onClick={startCountdown}
                            className="cursor-pointer"
                        >
                            <CountdownButton
                                initialSeconds={300}
                                buttonText={t("phoneValidation.validateCode.buttonText")}
                                className="text-base-content h-[45px]"
                                isDisabled={countdownButtonDisabled}
                                ref={countdownButtonRef}
                            />
                        </div>
                    </div>
                    {errors.form?.validateCode && <p className="text-red-600 OpenSans">{errors.form?.validateCode.message}</p>}
                    <div className="mt-[40px] flex justify-center">
                        <ReCAPTCHA
                            sitekey={recaptcha2Key}
                            onChange={onRecaptchaChange}
                            onErrored={onRecaptchaError}
                            onExpired={onRecaptchaExpired}
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
