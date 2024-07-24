"use client";
import { memo, useState, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { rightNowActivityDefaultHourPriceSelector } from "@/store-toolkit/stores/orderStore";
import { RightNowActivityOrderFormInterface } from "./orderInterface";
import type { UseFormRegister, Path } from "react-hook-form";
import { Radio } from "@material-tailwind/react";

const OrderByRadioTimeType = memo(({ lng, register, label, value, setValue, required }: { lng: string; register: UseFormRegister<RightNowActivityOrderFormInterface>; label: Path<RightNowActivityOrderFormInterface>; value: string; setValue: Function; required: boolean }) => {
    const { t } = useTranslation(lng, "main");

    const [form, setForm] = useState(value[0]);

    const handleFormChagne = useCallback(
        (event: any) => {
            const { name, value } = event.target;
            console.log("work =>", value, name);
            setForm(value);
            setValue(label, value);
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

            <div className="flex mt-[15px]">
                {timeTypes.map((type, index) => (
                    <div
                        key={type.value}
                        className={index === 0 ? "mr-[20px]" : ""}
                    >
                        {/* <Radio
                            {...register(label)}
                            name={label}
                            ripple={value === type.value}
                            label={<div className={`${value === type.value ? "text-primary" : ""} ml-[15px]`}>{type.label}</div>}
                            containerProps={{
                                className: "p-0",
                            }}
                            value={type.value}
                            onChange={handleFormChagne}
                            defaultChecked={value === type.value}
                            color="red"
                            className="
                            p-0
                            transition-all
                            duration-500"
                        /> */}
                        <input
                            {...register(label)}
                            id={type.value}
                            type="radio"
                            value={type.value}
                            className="checked:text-red-500 text-red-500  form-radio "
                            onChange={handleFormChagne}
                            checked={value === type.value}
                        />
                        <label
                            htmlFor={type.value}
                            className={`${value === type.value ? "text-primary" : ""} ml-[15px]`}
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
