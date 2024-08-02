"use client";
import { useState, useCallback, memo } from "react";
import { Input } from "antd";
import styles from "./styles/PhoneSmsValidateCodeInput.module.scss";
import { useTranslation } from "@/i18n/i18n-client";
import type { UseFormRegister, Path } from "react-hook-form";
import { PhoneValidationInterface } from "../phone-validation-interface";
import { NumberRegex } from "@/config/regex.config";

/**
 * 手機驗證碼輸入框 ui
 * @param param0
 * @returns
 */

const PhoneSmsValidateCodeInput = memo(({ lng, register, label, value, setValue, className }: { lng: string; register: UseFormRegister<PhoneValidationInterface>; label: Path<PhoneValidationInterface>; value: string; setValue: Function; className?: string | void }) => {
    const { t } = useTranslation(lng, "main");
    const [form, setForm] = useState<null | string>(value);

    const handleFormChagne = useCallback(
        (event: any) => {
            const { name, value } = event.target;
            if (NumberRegex.test(value) && value.length <= 6) {
                setForm(value);
                setValue(label, value);
            }
        },
        [form]
    );

    const handleOnKeyDown = (event: any) => {
        if (event.key === "Enter") {
            // 當點擊 enter 時取消按鈕的 click 事件
            event.preventDefault();
        }
        return;
    };

    return (
        <>
            <div className={`${className} ${styles["phone-sms-validate-code-input"]}`}>
                <Input
                    {...register(label)}
                    name="validateCode"
                    onChange={handleFormChagne}
                    onKeyDown={handleOnKeyDown}
                    placeholder={t("phoneValidation.validateCode.validation.requiredErrMessage")}
                    value={form!}
                />
            </div>
        </>
    );
});

export default PhoneSmsValidateCodeInput;
