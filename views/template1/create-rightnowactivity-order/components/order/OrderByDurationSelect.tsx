"use client";

import { memo, useState, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { rightNowActivityHourMaxDurationSelector, rightNowActivityHourMinDurationSelector } from "@/store-toolkit/stores/orderStore";
import { RightNowActivityOrderFormInterface } from "./order-interface";
import type { UseFormRegister, Path } from "react-hook-form";

/**
 * 活動時長下拉選擇 ui
 */
const OrderByDurationSelect = memo(({ lng, register, label, value, setValue, required }: { lng: string; register: UseFormRegister<RightNowActivityOrderFormInterface>; label: Path<RightNowActivityOrderFormInterface>; value: number; setValue: Function; required: boolean }) => {
    const { t } = useTranslation(lng, "main");

    const state = useAppSelector((state) => state.orderStore);

    const [form, setForm] = useState(value);

    const handleFormChagne = useCallback(
        (event: any) => {
            const { name, value } = event.target;
            console.log("work=>", value, name);
            setForm(value);
            setValue(label, value);
        },
        [form]
    );

    // 最小可選擇時數
    const minHourDurationSelector = rightNowActivityHourMinDurationSelector(state);
    /**
     * 最大可選擇時數
     * 因為後台會設定多 1 小時的值 但程式方面 需要在做 減 1 才會是預期呈現的畫面
     */
    const maxHourDurationSelector = rightNowActivityHourMaxDurationSelector(state) - 1;
    /**
     * 生成小時數列
     */
    const hours = Array.from({ length: maxHourDurationSelector }, (_, i) => i + minHourDurationSelector);

    return (
        <div className="mt-[40px]">
            <label
                form={label}
                className="text-gray-primary"
            >
                {t("rightNowActivityOrder.durationSelect.label")} {required && <span className="text-primary">*</span>}
                <select
                    {...register(label)}
                    className="border border-gray-secondary h-[40px] w-full rounded-md pl-5 mt-[15px]"
                    name={label}
                    value={form}
                    onChange={handleFormChagne}
                >
                    {hours.map((hour) => (
                        <option
                            key={hour}
                            value={hour}
                        >
                            {t("rightNowActivityOrder.durationSelect.hour", { hour: hour })}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
});

export default OrderByDurationSelect;
