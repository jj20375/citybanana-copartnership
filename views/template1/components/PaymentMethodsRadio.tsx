"use client";
import { memo, useState, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { UseFormRegister, Path } from "react-hook-form";

/**
 * 付款方式 ui
 */
const PaymentMethodsRadio = memo(({ lng, register, label, value, setValue, required, customClass }: { lng: string; register: UseFormRegister<any>; label: Path<any>; value: string | null | undefined; setValue: Function; required: boolean; customClass?: string | void }) => {
    const { t } = useTranslation(lng, "main");

    const [form, setForm] = useState(value);

    const onChange = useCallback(
        (val: any) => {
            setForm(val);
            setValue(label, val);
        },
        [form]
    );

    // 付款方式選項
    const paymentMethodOptions = [
        { label: t("global.paymentMethod-cash"), value: "cash" },
        { label: t("global.paymentMethod-credit"), value: "credit" },
    ];

    return (
        <div className={`flex flex-col ${customClass}`}>
            <label
                className="block mb-[15px] font-bold text-lg-content"
                htmlFor={label}
            >
                {t("rightNowActivityOrderPayment.paymentMethod")}
                {required && <span className="text-primary">*</span>}
            </label>
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
    );
});

export default PaymentMethodsRadio;
