"use client";

import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { rightNowActivityDefaultHourPriceSelector } from "@/store-toolkit/stores/orderStore";
import { RightNowActivityOrderFormInterface } from "./orderInterface";
import type { UseFormRegister, Path } from "react-hook-form";

/**
 * 活動出席費輸入框
 */
const OrderByPriceInput = memo(({ lng, register, label, value, setValue, required }: { lng: string; register: UseFormRegister<RightNowActivityOrderFormInterface>; label: Path<RightNowActivityOrderFormInterface>; value: number; setValue: Function; required: boolean }) => {
    const { t } = useTranslation(lng, "main");

    const state = useAppSelector((state) => state);

    function changeValue(newValue: number) {
        setValue(label, newValue);
    }

    // 每小時預設金額選項
    const hourPriceOptions = [...rightNowActivityDefaultHourPriceSelector(state), 0];

    // 按鈕選單
    const pricesHourButtons = (
        <ul className="grid gap-[0] grid-cols-4">
            {hourPriceOptions.map((price: number, index: number) => (
                <li
                    key={price}
                    className="flex justify-center w-full"
                >
                    <button
                        className={`${index % 4 === 3 ? "" : "mr-1"} OpenSans rounded-md border text-primary  flex-1 text-xs-content border-primary px-[10px] py-[5px]`}
                        onClick={() => changeValue(price)}
                    >
                        {price === 0 ? t("rightNowActivityOrder.price", { val: Number(price), customPrice: price }) : t("rightNowActivityOrder.price", { val: Number(price) })}
                    </button>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            <div className="max-w-[320px] mx-auto">
                <label
                    form={label}
                    className="text-gray-primary"
                >
                    {t("rightNowActivityOrder.priceInput.label")} {required && <span className="text-primary">*</span>}
                    <div className="relative h-[40px] my-[15px]">
                        {value === 0 ? (
                            <div className="border border-gray-secondary h-[40px] w-full rounded-md pl-5 flex items-center">{t("rightNowActivityOrder.price-0")}</div>
                        ) : (
                            <input
                                className="border border-gray-secondary h-[40px] w-full rounded-md pl-5"
                                {...register(label)}
                            />
                        )}
                        <p className="absolute top-[11px] leading-none right-2 font-light">{t("rightNowActivityOrder.priceInput.unit", { unit: t("global.priceUnit.hour") })}</p>
                    </div>
                </label>
                {pricesHourButtons}
            </div>
            <div>{t("rightNowActivityOrder.price", { val: 1000 })}</div>
            <div className="text-red-500">{value}</div>
            <button onClick={() => changeValue(100)}>測試更改價格</button>
            {JSON.stringify(hourPriceOptions)}
        </>
    );
});

export default OrderByPriceInput;
