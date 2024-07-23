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
            },
        },
    });

    const priceValue = watch("order.price");
    const durationValue = watch("order.duration");

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("success form =>", data);
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    return (
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
            {durationValue}小時
        </form>
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
            {JSON.stringify(rightNowActivityDefaultHourDuration, null, 4)}
        </>
    );
}
