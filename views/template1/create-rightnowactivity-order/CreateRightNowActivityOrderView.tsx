"use client";

import { useTranslation } from "@/i18n/i18n-client";
import TitleCompoent from "@/views/template1/components/TitleComponent";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import {
    rightNowActivityDefaultHourDurationSelector,
    rightNowActivityHourMaxDurationSelector,
    rightNowActivityHourMaxPriceSelector,
    rightNowActivityHourMinDurationSelector,
    rightNowActivityHourMinPriceSelector,
    rightNowActivityProviderMaxRequiredSelector,
    rightNowActivityProviderMinRequiredSelector,
} from "@/store-toolkit/stores/orderStore";
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
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { addDays, getYear, getMonth, subDays, addHours, startOfHour } from "date-fns";
import { isEmpty } from "@/service/utils";
import { setRightNowActivityDefaultValuesByParams } from "@/service/rightNowActivityOrder-service";

function CreateRightNowActivityOrderForm({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const state = useAppSelector((state) => {
        return state.orderStore;
    });
    type FormValues = RightNowActivityOrderFormInterface;
    // 即刻快閃最少每小時單價
    const rightNowActivityHourMinPrice = rightNowActivityHourMinPriceSelector(state);
    // 即刻快閃最多每小時單價
    const rightNowActivityHourMaxPrice = rightNowActivityHourMaxPriceSelector(state);
    // 即刻快閃最少招募人數
    const rightNowActivityProviderMinRequired = rightNowActivityProviderMinRequiredSelector(state);
    // 即刻快閃最多招募人數
    const rightNowActivityProviderMaxRequired = rightNowActivityProviderMaxRequiredSelector(state);
    // 即刻快閃最少預訂時數
    const rightNowActivityHourMinDuration = rightNowActivityHourMinDurationSelector(state);
    // 即刻快閃最多預訂時數
    const rightNowActivityHourMaxDuration = rightNowActivityHourMaxDurationSelector(state);

    const formSchema = yup.object({
        // 每小時單價驗證
        price: yup
            .number()
            .required(t("rightNowActivityOrder.priceInput.validation.price_reqiredErrMessage", { price: rightNowActivityHourMinPrice }))
            .test("price-min", t("rightNowActivityOrder.priceInput.validation.price_minErrorMessage", { val: rightNowActivityHourMinPrice }), function (val) {
                if (val > 0 && val < rightNowActivityHourMinPrice) {
                    return false;
                }
                return true;
            })
            .test("price-max", t("rightNowActivityOrder.priceInput.validation.price_maxErrorMessage", { val: rightNowActivityHourMaxPrice }), function (val) {
                if (val > 0 && val > rightNowActivityHourMaxPrice) {
                    return false;
                }
                return true;
            }),
        // 選擇現在或指定時間驗證
        timeType: yup.string().required(t("rightNowActivityOrder.radioTimeType.validation.timeType_reqiredErrMessage")),
        // 活動時數驗證
        duration: yup
            .number()
            .required(t("rightNowActivityOrder.durationSelect.validation.durationSelect_reqiredErrMessage"))
            .min(rightNowActivityHourMinDuration, t("rightNowActivityOrder.durationSelect.validation.durationSelect_minErrMessage", { val: rightNowActivityHourMinDuration }))
            .max(rightNowActivityHourMaxDuration, t("rightNowActivityOrder.durationSelect.validation.durationSelect_maxErrMessage", { val: rightNowActivityHourMaxDuration })),
        // 招募人數驗證
        requiredProviderCount: yup
            .number()
            .required("rightNowActivityOrder.requiredProviderCount.validation.requiredProviderCount_reqiredErrMessage")
            .min(rightNowActivityProviderMinRequired, t("rightNowActivityOrder.requiredProviderCount.validation.requiredProviderCount_minErrMessage", { val: rightNowActivityProviderMinRequired }))
            .max(rightNowActivityProviderMaxRequired, t("rightNowActivityOrder.requiredProviderCount.validation.requiredProviderCount_maxErrMessage", { val: rightNowActivityProviderMaxRequired })),

        startDate: yup.date().when("timeType", ([timeType], schema) => {
            return timeType === "chooseTime" ? schema.required(t("rightNowActivityOrder.startDateDatePicker.validation.startDate_reqiredErrMessage")) : schema.optional();
        }),
        startTime: yup.date().when("timeType", ([timeType], schema) => {
            return timeType === "chooseTime" ? schema.required(t("rightNowActivityOrder.startTimeTimePicker.validation.startTime_reqiredErrMessage")) : schema.optional();
        }),
        dueDate: yup.date().when("timeType", ([timeType], schema) => {
            return timeType === "chooseTime" ? schema.required(t("rightNowActivityOrder.dueDateDatePicker.validation.dueDate_reqiredErrMessage")) : schema.optional();
        }),
        dueTime: yup.date().when("timeType", ([timeType], schema) => {
            return timeType === "chooseTime" ? schema.required(t("rightNowActivityOrder.dueDateTime.validation.dueTime_reqiredErrMessage")) : schema.optional();
        }),
    });
    const [schema, setSchema]: any = useState(
        yup
            .object()
            .shape({
                order: formSchema,
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
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            order: { price: 0, duration: rightNowActivityDefaultHourDurationSelector(state), requiredProviderCount: rightNowActivityProviderMinRequired, timeType: "now", accept: true },
        },
    });

    const priceValue = watch("order.price");
    const durationValue = watch("order.duration");
    const requiredProviderCountValue = watch("order.requiredProviderCount");
    const timeTypeValue = watch("order.timeType");
    const startDateValue = watch("order.startDate");
    const startTimeValue = watch("order.startTime");
    const dueDateValue = watch("order.dueDate");
    const dueTimeValue = watch("order.dueTime");
    const noteValue = watch("order.note");
    const order = watch("order");

    // 網址參數
    const searchParams: any = useSearchParams();

    useEffect(() => {
        // 清空表單驗證 否則假設 有選擇了 日期資料後 會無法改變 按鈕 disabled 狀態
        clearErrors();
        // 判斷有網址參數時 不往下執行
        if (searchParams.size > 0) {
            return;
        }
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
        setValue("order.dueDate", addDays(new Date(), 1));
        setValue("order.dueTime", startOfHour(addHours(new Date(), 24)));
        return;
    }, [startDateValue]);

    useEffect(() => {
        // 判斷有網址參數時 不往下執行
        if (searchParams.size > 0) {
            return;
        }

        // 當活動開始時間 有變動時 招募截止日期跟著變動
        if (startTimeValue! > addHours(new Date(), 24)) {
            return setValue("order.dueTime", startOfHour(addHours(new Date(), 24)));
        }
        return setValue("order.dueTime", startTimeValue);
    }, [startTimeValue]);

    useEffect(() => {
        // 活動開始日期不往下執行
        if (dueDateValue === null) {
            return;
        }
        // 判斷有網址參數時 不往下執行
        if (searchParams.size > 0) {
            return;
        }

        /**
         * 當招募日期等於當天時
         * 1. 設定 招募截止時間為當下時間往後推1小時為預設值
         */
        if (dayjs(dueDateValue).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")) {
            // 設定 招募截止時間為當下時間往後推1小時為預設值
            return setValue("order.dueTime", startOfHour(addHours(new Date(dueDateValue as Date), 1)));
        }
        /**
         * 當招募截止日期大於當天時間時
         * 1. 招募截止時間為招募截止日期當天的中午12點整
         */
        return setValue("order.dueTime", startOfHour(addHours(new Date(), 24)));
    }, [dueDateValue]);

    const pathname = usePathname();
    useEffect(() => {
        // 判斷有網址參數時 需給表單填上預設值
        if (searchParams) {
            // 透過網址參數 設定即刻快閃單資料
            const params = setRightNowActivityDefaultValuesByParams(searchParams);
            if (Object.keys(params).length > 0) {
                setValue("order", params);
            }
            // 需清空網址參數 才可讓其他的 監聽值 startDate or dueDate ...做觸發
            history.pushState(null, "", pathname);
        }
    }, [searchParams]);

    /**
     * 下一步按鈕帶上 網址參數 START
     */
    const router = useRouter();
    const onNextStepButtonClick = () => {
        const origin = window.location.origin;
        const params = new URLSearchParams(order as any).toString();
        const host = `${origin}/${lng}/phone-validation`;
        router.push(`${host}?${params}`);
    };
    /**
     * 下一步按鈕帶上 網址參數 END
     */

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

    const total = useMemo(() => {
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
                    {errors.order?.price && <p className="text-red-600 OpenSans">{errors.order?.price.message}</p>}
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
                                    {t("rightNowActivityOrder.startTimeTimePicker.label")} {true && <span className="text-primary">*</span>}
                                </label>
                                <div className="flex">
                                    <OrderByStartDateDatePicker
                                        lng={lng}
                                        register={register}
                                        label="order.startDate"
                                        value={startDateValue}
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
                                {errors.order?.startDate && <p className="text-red-600 OpenSans">{errors.order?.startDate.message}</p>}
                                {errors.order?.startTime && <p className="text-red-600 OpenSans">{errors.order?.startTime.message}</p>}
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
                                {errors.order?.dueDate && <p className="text-red-600 OpenSans">{errors.order?.dueDate.message}</p>}
                                {errors.order?.dueTime && <p className="text-red-600 OpenSans">{errors.order?.dueTime.message}</p>}
                                {startDateValue && startTimeValue && dueDateValue && dueTimeValue ? <p className="text-gray-secondary text-xs-content mt-[15px]">最晚招募截止時間: {JSON.stringify(dayjs().add(24, "hour").format("YYYY-MM-DD a hh:mm"))}</p> : null}
                            </div>
                        </>
                    )}
                    <OrderByRequiredProviderCountSelect
                        lng={lng}
                        register={register}
                        label="order.requiredProviderCount"
                        value={requiredProviderCountValue}
                        setValue={setValue}
                        required={true}
                    />
                    <OrderByNoteTextarea
                        lng={lng}
                        register={register}
                        label="order.note"
                        value={noteValue}
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
                    <div className="border-b border-gray-primary mt-[40px] flex items-end">
                        <p className="text-gray-primary text-lg-content font-normal flex-1">{t("rightNowActivityOrder.total.label")}</p>
                        <p className="text-primary text-md-title OpenSans">{total === 0 ? t("rightNowActivityOrder.price", { val: Number(total), customPrice: total }) : t("rightNowActivityOrder.price", { val: Number(total) })}</p>
                    </div>

                    <button
                        type="submit"
                        className="PrimaryGradient DisabledGradient w-full rounded-md text-lg-content mt-[40px] text-white h-[45px] flex items-center justify-center"
                        disabled={errors.order ? true : false}
                    >
                        {t("global.nextStep")}
                    </button>
                </form>
                {/* <FormSample /> */}
                {/* <Link href={"/phone-validation?" + "a=2"}>
                    <button className="PrimaryGradient w-full rounded-md text-lg-content mt-[40px] text-white h-[45px] flex items-center justify-center">{t("global.nextStep")}</button>
                </Link> */}

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
    return (
        <>
            <TitleCompoent title={title} />
            <CreateRightNowActivityOrderForm lng={lng} />
        </>
    );
}
