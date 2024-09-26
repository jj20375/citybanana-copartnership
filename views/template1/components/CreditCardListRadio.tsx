"use client";
import { memo, useState, useCallback, useEffect } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { UseFormRegister, Path } from "react-hook-form";
import { GetCreditCardListAPI } from "@/api/userAPI/userAPI";

/**
 * 付款方式 ui
 */
const PaymentMethodsRadio = memo(
    ({
        lng,
        register,
        label,
        value,
        setValue,
        required,
        customClass,
        showChooseCreditCard,
        setShowChooseCreditCard,
        paymentMethodOptions,
    }: {
        lng: string;
        register: UseFormRegister<any>;
        label: Path<any>;
        value: string | null | undefined | void;
        setValue: Function;
        required: boolean;
        customClass?: string | void;
        showChooseCreditCard: boolean;
        setShowChooseCreditCard: Function;
        paymentMethodOptions: { label: string; value: string }[];
    }) => {
        const { t } = useTranslation(lng, "main");

        const [form, setForm] = useState(value);

        const onChange = useCallback(
            (val: any) => {
                setForm(val);
                setValue(label, val);
            },
            [form]
        );

        return (
            <>
                {showChooseCreditCard && (
                    <div className={`flex flex-col ${customClass}`}>
                        {paymentMethodOptions.map((type, index) => (
                            <div
                                key={type.value}
                                className={`flex items-center justify-start ${index === 0 ? "mt-[5px]" : "mt-[16px]"}`}
                            >
                                <div
                                    id={type.value}
                                    onClick={() => onChange(type.value)}
                                    className={`w-[18px] relative h-[18px] inline-block rounded-full cursor-pointer ${value !== type.value ? "border gray-primary" : "PrimaryGradient"}`}
                                >
                                    <div className="object-cover absolute w-full h-full flex items-center justify-center">{value === type.value && <div className="bg-white w-[5px] h-[5px] absolte  rounded-full"></div>}</div>
                                </div>
                                <label
                                    htmlFor={type.value}
                                    onClick={() => onChange(type.value)}
                                    className={`cursor-pointer ${value === type.value ? "text-primary" : ""} ml-[15px]`}
                                >
                                    {type.label}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }
);

export default PaymentMethodsRadio;
