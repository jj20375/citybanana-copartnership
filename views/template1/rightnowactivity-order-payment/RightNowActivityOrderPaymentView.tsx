"use client";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "@/i18n/i18n-client";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import TitleCompoent from "../components/TitleComponent";
import { useSearchParams, useRouter } from "next/navigation";
import { setRightNowActivityDefaultValuesByParams } from "@/service/rightNowActivityOrder-service";
import { RightNowActivityOrderPaymentFormInterface } from "./rightnowactivity-order-payment-interface";
import { isEmpty } from "@/service/utils";
import dayjs from "dayjs";
import { isValid } from "date-fns";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store-toolkit/storeToolkit";
import { userNameSelector, setUserProfile } from "@/store-toolkit/stores/userStore";
import { RightNowActivityOrderFormInterface } from "../create-rightnowactivity-order/components/order/order-interface";
import ContactWe from "../components/ContactWe";
import RightNowActivityOrderPaymentContactInput from "./components/RightNowActivityOrderPaymentContactInput";
import GenderRadio from "../components/GenderRadio";
import CreditCardForm from "../components/CreditCardForm";
import PaymentMethodsRadio from "../components/PaymentMethodsRadio";
import ButtonBorderGradient from "../components/ButtonBorderGradient";
export default function RightNowActivityOrderPaymentView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const title = t("rightNowActivityOrderPayment.title");

    const state = useAppSelector((state) => {
        return state.userStore;
    });

    const dispatch = useAppDispatch();

    const userName = userNameSelector(state);

    type FormValues = RightNowActivityOrderPaymentFormInterface;
    type OrderFormValues = RightNowActivityOrderFormInterface;

    const paymentFormSchema = yup.object({
        // 判斷是否需要輸入名稱
        needName: yup.boolean(),
        // 聯絡姓名
        contactName: yup.string().when("needName", ([needName], schema) => {
            return needName ? schema.required(t("rightNowActivityOrderPayment.validation.contactName_requiredErrMessage")) : schema.optional();
        }),
        // 性別
        gender: yup.string<"male" | "female">().when("needName", ([needName], schema) => {
            return needName ? schema.required(t("rightNowActivityOrderPayment.validation.gender_requiredErrMessage")) : schema.optional();
        }),
        // 付款方式
        paymentMethod: yup.string<"cash" | "credit">().required("rightNowActivityOrderPayment.validation.paymentMethod_requiredErrMessage"),
    });

    const [schema, setSchema]: any = useState(
        yup
            .object()
            .shape({
                payment: paymentFormSchema,
            })
            .required()
    );

    const {
        reset,
        register,
        control,
        handleSubmit,
        watch,
        getValues,
        setValue,
        clearErrors,
        trigger,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            payment: {
                needName: isEmpty(userName),
                contactName: "",
                gender: "male",
                paymentMethod: "cash",
            },
        },
    });

    const contactNameValue = watch("payment.contactName");
    const genderValue = watch("payment.gender");
    const paymentMethodValue = watch("payment.paymentMethod");

    /**
     * submit 成功時往下一步
     * @param data
     */
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("success form =>", data);
        onNextStepButtonClick();
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    const router = useRouter();
    const onNextStepButtonClick = () => {
        reset();
        const origin = window.location.origin;
        const params = new URLSearchParams(order as any).toString();
        const host = `${origin}/${lng}/rightnowactivity-recruitment-order/1`;
        router.push(`/rightnowactivity-recruitment-order/1`);
    };

    // 上一步按鈕事件
    const onPrevStepButtonClick = () => {
        reset();
        const origin = window.location.origin;
        const host = `${origin}/${lng}/create-rightnowactivity-order`;
        router.push(`${host}?${searchParams.toString()}`);
        return;
    };

    type DisplayOrder = {
        title: string;
        datas: {
            label: string;
            value: string;
        }[];
    };

    // 網址參數
    const searchParams: any = useSearchParams();

    // 訂單資料
    const [order, setOrder] = useState<OrderFormValues>();
    // 顯示用的訂單資料
    const [displayOrder, setDisplayOrder] = useState<DisplayOrder>();

    const total = useMemo(() => {
        const priceValue = isEmpty(order) ? 0 : order!.price;
        const durationValue = isEmpty(order) ? 0 : order!.duration;
        return priceValue * durationValue;
    }, [order?.price, order?.duration]);

    useEffect(() => {
        // 判斷有網址參數時 需給表單填上預設值
        if (searchParams) {
            // 透過網址參數 設定即刻快閃單資料
            const params = setRightNowActivityDefaultValuesByParams(searchParams);
            if (Object.keys(params).length > 0) {
                setOrder(params);
                setDisplayOrder({
                    title: "海底撈火鍋-京站店",
                    datas: [
                        {
                            label: t("rightNowActivityOrderPayment.column-startDate"),
                            value: isValid(params.startDate) ? dayjs(params.startTime).format("YYYY-MM-DD HH:mm:ss") : t("rightNowActivityOrderPayment.startTime-now"),
                        },
                        {
                            label: t("rightNowActivityOrderPayment.column-dueDate"),
                            value: isValid(params.dueDate) ? dayjs(params.dueTime).format("YYYY-MM-DD HH:mm:ss") : t("rightNowActivityOrderPayment.dueTime-now", { minute: 60 }),
                        },
                        {
                            label: t("rightNowActivityOrderPayment.column-duration"),
                            value: t("global.hour", { hour: params.duration }),
                        },
                        {
                            label: t("rightNowActivityOrderPayment.column-price"),
                            value: params.price > 0 ? t("rightNowActivityOrder.price", { val: params.price * params.duration }) : t("rightNowActivityOrderPayment.price-0"),
                        },
                        {
                            label: t("rightNowActivityOrderPayment.column-requiredProviderCount"),
                            value: params.requiredProviderCount + " " + t("global.people"),
                        },
                    ],
                });
            }
        }
    }, [searchParams]);

    return (
        <>
            <TitleCompoent title={title} />
            <div className="mx-auto max-w-[400px] mt-[40px]">
                <div className="border border-gray-third rounded-md p-[15px]">
                    <div className="flex items-center mb-[13px] border-b border-gray-light pb-[13px] font-bold">
                        <Image
                            className="mr-[10px]"
                            src="/img/icons/calendar.svg"
                            width={20}
                            height={20}
                            alt="calendar"
                            style={{ width: "24px", height: "auto" }}
                        />
                        <h5 className="text-sm-title text-gray-primary">{displayOrder?.title}</h5>
                    </div>
                    <ul>
                        {displayOrder?.datas.map((item) => {
                            return (
                                <li
                                    key={item.value}
                                    className="mb-[5px]"
                                >
                                    <span className="text-gray-third  text-lg-content mr-[10px]">{item.label}</span> <span className="text-gray-primary text-lg-content OpenSans">{item.value}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <form
                    className="mt-[40px]"
                    onSubmit={handleSubmit(onSubmit, onError)}
                >
                    <RightNowActivityOrderPaymentContactInput
                        lng={lng}
                        register={register}
                        label="payment.contactName"
                        value={contactNameValue}
                        setValue={setValue}
                        required={true}
                    />
                    {errors.payment?.contactName && <p className="text-red-600 OpenSans">{errors.payment?.contactName.message}</p>}
                    <GenderRadio
                        lng={lng}
                        label="payment.gender"
                        value={genderValue}
                        setValue={setValue}
                        register={register}
                        required={true}
                        customClass="pt-[15px]"
                    />
                    <PaymentMethodsRadio
                        lng={lng}
                        label="payment.paymentMethod"
                        value={paymentMethodValue}
                        setValue={setValue}
                        register={register}
                        required={true}
                        customClass="mt-[40px]"
                    />
                </form>
                <CreditCardForm
                    lng={lng}
                    required={true}
                    customClass="mt-[15px]"
                />
                <div className="border-b border-gray-primary mt-[40px] flex items-end">
                    <p className="text-gray-primary text-lg-content font-normal flex-1">{t("rightNowActivityOrder.total.label")}</p>
                    <p className="text-primary text-md-title OpenSans">{total === 0 ? t("rightNowActivityOrder.price", { val: Number(total), customPrice: total }) : t("rightNowActivityOrder.price", { val: Number(total) })}</p>
                </div>
                <div className="flex flex-col text-lg-content mt-[40px]">
                    <ButtonBorderGradient
                        onClick={handleSubmit(onSubmit, onError)}
                        buttonText={t("global.nextStep")}
                        outsideClassName={`${!false ? "PrimaryGradient" : "DisabledGradientByOutlineBtn"}  p-px rounded-md w-full`}
                        insideClassName={`${!false ? "PrimaryGradient" : "DisabledGradientByOutlineBtn"} rounded-[calc(0.5rem-3px)] p-2 w-full flex items-center justify-center text-white h-[45px]`}
                        isDisabled={false}
                        buttonType="submit"
                    />
                    <button
                        type="button"
                        onClick={onPrevStepButtonClick}
                        disabled={false}
                        className="mt-[15px] DisabledBg border bg-white border-primary rounded-md w-full h-[45px] text-primary"
                    >
                        {t("rightNowActivityOrderPayment.prevStep")}
                    </button>
                </div>

                <ContactWe lng={lng} />
            </div>
            <pre>{JSON.stringify(displayOrder, null, 4)}</pre>
            <div className="h-[50px]"></div>
            <pre>{JSON.stringify(order, null, 4)}</pre>
        </>
    );
}
