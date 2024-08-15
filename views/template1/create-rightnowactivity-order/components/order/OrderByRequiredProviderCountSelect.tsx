"use client";

import { memo, useState, useCallback, useEffect } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { rightNowActivityProviderMinRequiredSelector, rightNowActivityProviderMaxRequiredSelector } from "@/store-toolkit/stores/orderStore";
import { RightNowActivityOrderCreateFormInterface } from "./order-interface";
import type { UseFormRegister, Path } from "react-hook-form";

/**
 * 服務商需求人數 ui
 */
const OrderByRequiredProviderCountSelect = memo(
    ({ lng, register, label, value, setValue, required }: { lng: string; register: UseFormRegister<RightNowActivityOrderCreateFormInterface>; label: Path<RightNowActivityOrderCreateFormInterface>; value: number; setValue: Function; required: boolean }) => {
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

        // 服務商最少招募人數
        const minRequiredSelector = rightNowActivityProviderMinRequiredSelector(state);
        /**
         * 服務商最多招募人數
         * 因為後台會設定多 1 小時的值 但程式方面 需要在做 減 1 才會是預期呈現的畫面
         */
        const maxRequiredSelector = rightNowActivityProviderMaxRequiredSelector(state) - 1;
        /**
         * 生成可選擇人數範圍
         */
        const requiredRangeSelect = Array.from({ length: maxRequiredSelector }, (_, i) => i + minRequiredSelector);

        useEffect(() => {
            setForm(value);
        }, [value]);

        return (
            <div className="mt-[40px]">
                <label
                    form={label}
                    className="text-gray-primary"
                >
                    {t("rightNowActivityOrder.requiredProviderCount.label")} {required && <span className="text-primary">*</span>}
                    <select
                        {...register(label)}
                        className="border border-gray-secondary h-[40px] w-full rounded-md pl-5 mt-[15px]"
                        name={label}
                        value={form}
                        onChange={handleFormChagne}
                    >
                        {requiredRangeSelect.map((count) => (
                            <option
                                key={count}
                                value={count}
                            >
                                {t("rightNowActivityOrder.requiredProviderCount.requiredCount", { count: count })}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        );
    }
);

export default OrderByRequiredProviderCountSelect;
