"use client";
import { memo, useCallback, useState } from "react";
import type { UseFormRegister, Path } from "react-hook-form";
import { RightNowActivityOrderPaymentFormInterface } from "../rightnowactivity-order-payment-interface";
import { Input } from "antd";
import styles from "./styles/RightNowActivityOrderPaymentContactInput.module.scss";
import { useTranslation } from "@/i18n/i18n-client";

/**
 * 聯絡資訊 名稱輸入框 ui
 */

const RightNowActivityOrderPaymentContactInput = memo(
    ({ lng, register, label, value, setValue, required }: { lng: string; register: UseFormRegister<RightNowActivityOrderPaymentFormInterface>; label: Path<RightNowActivityOrderPaymentFormInterface>; value: string | undefined; setValue: Function; required: boolean }) => {
        const { t } = useTranslation(lng, "main");

        const [name, setName] = useState<null | string | undefined>(value);

        const handleNameChange = useCallback(
            (event: any) => {
                const { name, value } = event.target;
                if (value.length <= 10) {
                    setName(value);
                    setValue(label, value);
                }
            },
            [name]
        );

        const handleOnPhoneKeyDown = (event: any) => {
            if (event.key === "Enter") {
                // 當點擊 enter 時取消按鈕的 click 事件
                event.preventDefault();
            }
            return;
        };

        return (
            <>
                <div className={styles["rightnowactivity-order-payment-contact-input"]}>
                    <label
                        className="block mb-[15px] font-bold text-lg-content"
                        htmlFor={label}
                    >
                        {t("rightNowActivityOrderPayment.contact")}
                        {required && <span className="text-primary">*</span>}
                    </label>
                    <p className="text-lg-content text-gray-primary mb-[15px]">{t("rightNowActivityOrderPayment.contactName")}</p>
                    <Input
                        id={label}
                        {...register(label)}
                        type="text"
                        name="name"
                        onChange={handleNameChange}
                        onKeyDown={handleOnPhoneKeyDown}
                        value={name!}
                    />
                </div>
            </>
        );
    }
);

export default RightNowActivityOrderPaymentContactInput;
