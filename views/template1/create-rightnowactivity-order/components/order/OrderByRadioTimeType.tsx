"use client";
import { memo, useState, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { RightNowActivityOrderFormInterface } from "./order-interface";
import type { UseFormRegister, Path } from "react-hook-form";

/**
 * 活動開始時間 為 現在 或者 指定時間 ui
 */
const OrderByRadioTimeType = memo(({ lng, register, label, value, setValue, required }: { lng: string; register: UseFormRegister<RightNowActivityOrderFormInterface>; label: Path<RightNowActivityOrderFormInterface>; value: string; setValue: Function; required: boolean }) => {
    const { t } = useTranslation(lng, "main");

    const [form, setForm] = useState(value);

    const handleFormChagne = useCallback(
        (event: any) => {
            const { name, value } = event.target;
            console.log("work =>", value, name);
            setForm(value);
            setValue(label, value);
        },
        [form]
    );

    const onChange = useCallback(
        (val: any) => {
            setForm(val);
            setValue(label, val);
        },
        [form]
    );

    // 判斷是鉉則
    const timeTypes = [
        { label: t("rightNowActivityOrder.radioTimeType.label_now"), value: "now" },
        { label: t("rightNowActivityOrder.radioTimeType.label_chooseTime"), value: "chooseTime" },
    ];

    return (
        <div className="mt-[40px]">
            <label
                form={label}
                className="text-gray-primary"
            >
                {t("rightNowActivityOrder.radioTimeType.label")} {required && <span className="text-primary">*</span>}
            </label>

            <div className="flex my-[15px]">
                {timeTypes.map((type, index) => (
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
                        {/* <input
                            {...register(label)}
                            id={type.value}
                            type="radio"
                            value={type.value}
                            className="checked:text-red-500 text-red-500  form-radio "
                            onChange={handleFormChagne}
                            checked={value === type.value}
                        /> */}
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
        </div>
    );
});

export default OrderByRadioTimeType;
