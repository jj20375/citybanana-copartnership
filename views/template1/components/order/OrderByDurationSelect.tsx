"use client";

import { memo, useState, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { rightNowActivityDefaultHourPriceSelector } from "@/store-toolkit/stores/orderStore";
import { RightNowActivityOrderFormInterface } from "./orderInterface";
import type { UseFormRegister, Path } from "react-hook-form";

/**
 * 活動時長下拉選擇
 */
const OrderByDurationSelect = memo(({ lng, register, label, value, setValue, required }: { lng: string; register: UseFormRegister<RightNowActivityOrderFormInterface>; label: Path<RightNowActivityOrderFormInterface>; value: number; setValue: Function; required: boolean }) => {
    console.log("OrderByDurationSelect render");
    const { t } = useTranslation(lng, "main");

    const state = useAppSelector((state) => state);

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

    // 生成小時數列
    const hours = Array.from({ length: 23 }, (_, i) => i + 2);

    return (
        <div className="mt-[40px]">
            <label
                form={label}
                className="text-gray-primary"
            >
                {t("rightNowActivityOrder.durationSelect.label")} {required && <span className="text-primary">*</span>}
                <select
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
                            {hour} 小時
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
});

export default OrderByDurationSelect;
