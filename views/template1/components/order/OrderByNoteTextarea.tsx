"use client";

import { memo, useState, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { rightNowActivityProviderMinRequiredSelector, rightNowActivityProviderMaxRequiredSelector } from "@/store-toolkit/stores/orderStore";
import { RightNowActivityOrderFormInterface } from "./orderInterface";
import type { UseFormRegister, Path } from "react-hook-form";
import { Input } from "antd";
const { TextArea } = Input;

/**
 * 訂單需求備註
 */
const OrderByNoteTextarea = memo(({ lng, register, label, value, setValue, required }: { lng: string; register: UseFormRegister<RightNowActivityOrderFormInterface>; label: Path<RightNowActivityOrderFormInterface>; value: string | null; setValue: Function; required: boolean }) => {
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
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log("Change:", e.target.value);
    };

    return (
        <div className="mt-[40px]">
            <label
                form={label}
                className="text-gray-primary mb-[15px] block"
            >
                {t("rightNowActivityOrder.noteTextarea.label")} {required && <span className="text-primary">*</span>}
            </label>
            <TextArea
                value={form!}
                showCount
                className="border-gray-secondary"
                onChange={(e) => handleFormChagne(e)}
                placeholder={t("rightNowActivityOrder.noteTextarea.placeholder")}
                autoSize={{ minRows: 3, maxRows: 5 }}
                maxLength={50}
            />
        </div>
    );
});

export default OrderByNoteTextarea;
