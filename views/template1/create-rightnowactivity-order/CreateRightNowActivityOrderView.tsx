"use client";

import { useTranslation } from "@/i18n/i18n-client";
import TitleCompoent from "@/views/template1/components/TitleComponent";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { rightNowActivityDefaultHourDurationSelector, rightNowActivityHourMinPriceSelector, rightNowActivityProviderMinRequiredSelector } from "@/store-toolkit/stores/orderStore";
import * as yup from "yup";
import { useEffect, useState, useMemo, useCallback } from "react";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RightNowActivityOrderFormInterface } from "./components/order/order-interface";
import OrderByPriceInput from "./components/order/OrderByPriceInput";
import OrderByDurationSelect from "./components/order/OrderByDurationSelect";
import OrderByRadioTimeType from "./components/order/OrderByRadioTimeType";
import OrderByStartDateDatePicker from "./components/order/OrderByStartDateDatePicker";
import OrderByDueDateDatePicker from "./components/order/OrderByDueDateDatePicker";
import OrderByStartTimeTimePicker from "./components/order/OrderByStartTimeTimePicker";
import OrderByDueDateTimeTimePicker from "./components/order/OrderByDueDateTimeTimePicker";
import OrderByRequiredProviderCountSelect from "./components/order/OrderByRequiredProviderCountSelect";
import OrderByNoteTextarea from "./components/order/OrderByNoteTextarea";
import dayjs from "dayjs";
import Link from "next/link";
import FormSample from "@/layouts/template1/HeaderComponents/Login/LoginForm/FormSample";
import ContactWe from "@/views/template1/components/ContactWe";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function CreateRightNowActivityOrderForm({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const state = useAppSelector((state) => {
        return state;
    });
    type FormValues = RightNowActivityOrderFormInterface;
    const rightNowActivityHourMinPrice = rightNowActivityHourMinPriceSelector(state);

    const formSchema = {
        price: yup.number().required(t("validation.rightNowActivityOrder.price", { price: rightNowActivityHourMinPrice })),
        timeType: yup.string().required(t("validation.rightNowActivityOrder.timeType")),
    };
    const [schema, setSchema]: any = useState(
        yup
            .object()
            .shape({
                order: yup.object().shape(formSchema),
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
            order: {
                price: 0,
                duration: rightNowActivityDefaultHourDurationSelector(state),
                requiredNumber: rightNowActivityProviderMinRequiredSelector(state),
                timeType: "now",
                accept: true,
            },
        },
    });

    const priceValue = watch("order.price");
    const durationValue = watch("order.duration");
    const requiredNumberValue = watch("order.requiredNumber");
    const timeTypeValue = watch("order.timeType");
    const startDateValue = watch("order.startDate");
    const startTimeValue = watch("order.startTime");
    const dueDateValue = watch("order.dueDate");
    const dueTimeValue = watch("order.dueTime");
    const order = watch("order");

    const paramsObj = { foo: "bar", baz: "bar" };

    useEffect(() => {
        /**
         * 當活東開始日期等於當天時
         * 1. 設定 活動開始時間為當下時間往後推1小時為預設值
         * 2. 招募截止日期 = 活動開始日期
         * 3. 招募截止時間 = 活動開始時間
         */
        if (dayjs(startDateValue).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")) {
            // 設定 活動開始時間為當下時間往後推1小時為預設值
            setValue(
                "order.startTime",
                dayjs(startDateValue)
                    .add(dayjs().hour() + 1, "hours")
                    .toDate()
            );
            // 招募截止日期 = 活動開始日期
            setValue("order.dueDate", startDateValue);
            // 招募截止時間 = 活動開始時間
            setValue("order.dueTime", startTimeValue);
            return;
        }
        /**
         * 當活動開始日期大於當天時
         * 1. 活動開始時間為活動日期當天的中午12點整
         * 2. 招募截止日期為活動開始日期
         * 3. 招募截止時間為活動開始時間
         */
        setValue("order.startTime", dayjs(startDateValue).add(12, "hours").toDate());
        setValue("order.dueDate", startDateValue);
        setValue("order.dueTime", startTimeValue);
        return;
    }, [startDateValue]);

    useEffect(() => {
        // 當活動開始時間 有變動時 招募截止日期跟著變動
        setValue("order.dueTime", startTimeValue);
    }, [startTimeValue]);

    useEffect(() => {
        // 活動開始日期不往下執行
        if (dueDateValue === null) {
            return;
        }
        /**
         * 當招募日期等於當天時
         * 1. 設定 招募截止時間為當下時間往後推1小時為預設值
         */
        if (dayjs(dueDateValue).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")) {
            // 設定 招募截止時間為當下時間往後推1小時為預設值
            return setValue(
                "order.dueTime",
                dayjs(dueDateValue)
                    .add(dayjs().hour() + 1, "hours")
                    .toDate()
            );
        }
        /**
         * 當招募截止日期大於當天時間時
         * 1. 招募截止時間為招募截止日期當天的中午12點整
         */
        return setValue("order.dueTime", dayjs(dueDateValue).add(12, "hours").toDate());
    }, [dueDateValue]);

    /**
     * 下一步按鈕帶上 網址參數 START
     */
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (orderData: any) => {
            if (searchParams) {
                const params = new URLSearchParams(searchParams.toString());
                // params.set(name, value);
                Object.keys(orderData).forEach((key: string) => {
                    params.set(key, orderData[key]);
                });
                return params.toString();
            }
            return null;
        },
        [searchParams]
    );

    const onNextStepButtonClick = () => {
        const origin = window.location.origin;
        const host = `${origin}/${lng}/phone-validation`;
        router.push(`${host}?${createQueryString(order)}`);
    };
    /**
     * 下一步按鈕帶上 網址參數 END
     */

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("success form =>", data);
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    const total = useMemo(() => {
        console.log("priceValue =>", priceValue);
        console.log("durationValeu =>", durationValue);
        return priceValue * durationValue;
    }, [priceValue, durationValue]);

    return (
        <div className="flex">
            <div className="mx-auto max-w-[400px]">
                <form
                    className="mt-[40px]"
                    onSubmit={handleSubmit(onSubmit, onError)}
                >
                    <OrderByPriceInput
                        lng={lng}
                        register={register}
                        label="order.price"
                        value={priceValue}
                        setValue={setValue}
                        required={true}
                    />
                    <OrderByDurationSelect
                        lng={lng}
                        register={register}
                        label="order.duration"
                        value={durationValue}
                        setValue={setValue}
                        required={true}
                    />
                    <OrderByRadioTimeType
                        lng={lng}
                        register={register}
                        label="order.timeType"
                        value={timeTypeValue}
                        setValue={setValue}
                        required={true}
                    />
                    {timeTypeValue === "now" && (
                        <div className="text-base-content text-gray-third">
                            {t("rightNowActivityOrder.radioTimeType.description_start")}：<span className="text-primary mx-1">60</span>
                            {t("rightNowActivityOrder.radioTimeType.description_end")}
                        </div>
                    )}
                    {timeTypeValue === "chooseTime" && (
                        <>
                            <div>
                                <label className="text-gray-secondary mb-[15px] block">
                                    {t("rightNowActivityOrder.startDateTime.label")} {true && <span className="text-primary">*</span>}
                                </label>
                                <div className="flex">
                                    <OrderByStartDateDatePicker
                                        lng={lng}
                                        register={register}
                                        label="order.startDate"
                                        value={null}
                                        setValue={setValue}
                                        required={true}
                                    />
                                    <div className="ml-[15px]">
                                        {startDateValue && (
                                            <OrderByStartTimeTimePicker
                                                lng={lng}
                                                register={register}
                                                label="order.startTime"
                                                value={startTimeValue}
                                                setValue={setValue}
                                                required={true}
                                                startDate={startDateValue}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-[15px]">
                                <label className="text-gray-secondary mb-[15px] block">
                                    {t("rightNowActivityOrder.dueDateTime.label")} {true && <span className="text-primary">*</span>}
                                </label>
                                <div className="flex">
                                    {startDateValue && (
                                        <OrderByDueDateDatePicker
                                            lng={lng}
                                            register={register}
                                            label="order.dueDate"
                                            value={dueDateValue}
                                            setValue={setValue}
                                            required={true}
                                            startDate={startDateValue}
                                        />
                                    )}
                                    {startDateValue && startTimeValue && dueDateValue ? (
                                        <div className="ml-[15px]">
                                            <OrderByDueDateTimeTimePicker
                                                lng={lng}
                                                register={register}
                                                label="order.dueTime"
                                                value={dueTimeValue}
                                                setValue={setValue}
                                                required={true}
                                                startDate={startDateValue}
                                                startTime={startTimeValue}
                                                dueDate={dueDateValue}
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </>
                    )}
                    <OrderByRequiredProviderCountSelect
                        lng={lng}
                        register={register}
                        label="order.requiredNumber"
                        value={requiredNumberValue}
                        setValue={setValue}
                        required={true}
                    />
                    <OrderByNoteTextarea
                        lng={lng}
                        register={register}
                        label="order.note"
                        value={null}
                        setValue={setValue}
                        required={false}
                    />
                    <div className="mt-[40px] flex items-start">
                        <input
                            id="order.accept"
                            {...register("order.accept")}
                            type="checkbox"
                            className="mr-[15px] mt-0.5"
                        />
                        <label
                            className="text-gray-primary block leading-none m-0 p-0 underline font-light"
                            htmlFor="order.accept"
                        >
                            {t("rightNowActivityOrder.accept.label")}
                        </label>
                    </div>
                </form>
                {/* <FormSample /> */}
                <div className="border-b border-gray-primary mt-[40px] flex items-end">
                    <p className="text-gray-primary text-lg-content font-normal flex-1">{t("rightNowActivityOrder.total.label")}</p>
                    <p className="text-primary text-md-title OpenSans">{total === 0 ? t("rightNowActivityOrder.price", { val: Number(total), customPrice: total }) : t("rightNowActivityOrder.price", { val: Number(total) })}</p>
                </div>
                {/* <Link href={"/phone-validation?" + "a=2"}>
                    <button className="PrimaryGradient w-full rounded-md text-lg-content mt-[40px] text-white h-[45px] flex items-center justify-center">{t("global.nextStep")}</button>
                </Link> */}
                <button
                    onClick={onNextStepButtonClick}
                    className="PrimaryGradient w-full rounded-md text-lg-content mt-[40px] text-white h-[45px] flex items-center justify-center"
                >
                    {t("global.nextStep")}
                </button>
                {JSON.stringify(searchParams)}
                <ContactWe lng={lng} />
                <div className="h-[123px] w-full"></div>
            </div>
            <pre className="flex">{JSON.stringify(order, null, 4)}</pre>
        </div>
    );
}

export default function CreateRightNowActivityOrderView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const title = "海底撈火鍋-京站店";
    const rightNowActivityConfiguration = useAppSelector((state) => state.orderStore.rightNowActivityConfiguration);
    const state = useAppSelector((state) => {
        return state;
    });
    const rightNowActivityDefaultHourDuration = rightNowActivityDefaultHourDurationSelector(state);
    return (
        <>
            <TitleCompoent title={title} />
            <CreateRightNowActivityOrderForm lng={lng} />
        </>
    );
}
