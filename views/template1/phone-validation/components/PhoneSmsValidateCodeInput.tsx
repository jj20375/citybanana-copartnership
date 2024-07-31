"use client";
import { useState, useCallback, memo } from "react";
import { Input } from "antd";
import styles from "./styles/PhoneSmsValidateCodeInput.module.scss";
import { useTranslation } from "@/i18n/i18n-client";
import type { UseFormRegister, Path } from "react-hook-form";
import { PhoneValidationInterface } from "../phone-validation-interface";

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
            setForm(value);
            setValue(label, value);
        },
        [form]
    );

    return (
        <>
            <div className={`${className} ${styles["phone-sms-validate-code-input"]}`}>
                <Input
                    {...register(label)}
                    name="validateCode"
                    onChange={handleFormChagne}
                    placeholder={t("phoneValidation.validateCode.requiredMessage")}
                />
            </div>
        </>
    );
});

export default PhoneSmsValidateCodeInput;
