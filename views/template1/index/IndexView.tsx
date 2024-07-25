"use client";

import { useTranslation } from "@/i18n/i18n-client";
import TitleCompoent from "@/views/template1/components/TitleComponent";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { rightNowActivityDefaultHourDurationSelector, rightNowActivityHourMinPriceSelector } from "@/store-toolkit/stores/orderStore";
import * as yup from "yup";
import { useEffect, useState } from "react";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RightNowActivityOrderFormInterface } from "../components/order/orderInterface";
import OrderByPriceInput from "../components/order/OrderByPriceInput";
import OrderByDurationSelect from "../components/order/OrderByDurationSelect";
import OrderByRadioTimeType from "../components/order/OrderByRadioTimeType";
import OrderByStartDateDatePicker from "../components/order/OrderByStartDateDatePicker";
import OrderByDueDateDatePicker from "../components/order/OrderByDueDateDatePicker";
import OrderByStartTimeTimePicker from "../components/order/OrderByStartTimeTimePicker";
import FormSample from "@/layouts/template1/HeaderComponents/Login/LoginForm/FormSample";

function IndexCreateOrder({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const state = useAppSelector((state) => {
        return state;
    });
    type FormValues = RightNowActivityOrderFormInterface;
    const rightNowActivityHourMinPrice = rightNowActivityHourMinPriceSelector(state);

    const formSchema = {
        price: yup.number().required(t("validation.rightNowActivityOrder.price", { price: rightNowActivityHourMinPrice })),
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
                duration: 3,
                requiredNumber: 2,
                timeType: "now",
            },
        },
    });

    const priceValue = watch("order.price");
    const durationValue = watch("order.duration");
    const timeTypeValue = watch("order.timeType");
    const startDateValue = watch("order.startDate");
    const order = watch("order");

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("success form =>", data);
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    return (
        <div className="mx-auto max-w-[320px]">
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
                <OrderByStartDateDatePicker
                    lng={lng}
                    register={register}
                    label="order.startDate"
                    value={null}
                    setValue={setValue}
                    required={true}
                />
                {startDateValue && (
                    <OrderByStartTimeTimePicker
                        lng={lng}
                        register={register}
                        label="order.startTime"
                        value={null}
                        setValue={setValue}
                        required={true}
                        startDate={startDateValue}
                    />
                )}
                {startDateValue && (
                    <OrderByDueDateDatePicker
                        lng={lng}
                        register={register}
                        label="order.dueDate"
                        value={null}
                        setValue={setValue}
                        required={true}
                        startDate={startDateValue}
                    />
                )}
                {JSON.stringify(order, null, 4)}
            </form>
            <FormSample />
        </div>
    );
}

export default function IndexView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const title = t("index.title");
    const rightNowActivityConfiguration = useAppSelector((state) => state.orderStore.rightNowActivityConfiguration);
    const state = useAppSelector((state) => {
        return state;
    });
    const rightNowActivityDefaultHourDuration = rightNowActivityDefaultHourDurationSelector(state);
    return (
        <>
            <TitleCompoent title={title} />
            <IndexCreateOrder lng={lng} />
        </>
    );
}
