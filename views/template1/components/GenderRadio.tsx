"use client";
import { memo, useState, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { UseFormRegister, Path } from "react-hook-form";

/**
 * 性別選項 ui
 */
const GenderRadio = memo(({ lng, register, label, value, setValue, required }: { lng: string; register: UseFormRegister<any>; label: Path<any>; value: string | null | undefined; setValue: Function; required: boolean }) => {
    const { t } = useTranslation(lng, "main");

    const [form, setForm] = useState(value);

    const onChange = useCallback(
        (val: any) => {
            setForm(val);
            setValue(label, val);
        },
        [form]
    );

    // 性別選項
    const genderOptions = [
        { label: t("global.gender-male"), value: "male" },
        { label: t("global.gender-female"), value: "female" },
    ];

    return (
        <div className="flex my-[15px]">
            {genderOptions.map((type, index) => (
                <div
                    key={type.value}
                    className={`flex items-center justify-center ${index === 0 ? "mr-[20px]" : ""}`}
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

export default GenderRadio;
