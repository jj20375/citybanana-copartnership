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
    ({ lng, register, nameLabel, parentName, setParentName }: { lng: string; register: UseFormRegister<RightNowActivityOrderPaymentFormInterface>; nameLabel: Path<RightNowActivityOrderPaymentFormInterface>; parentName: string; setParentName: Function }) => {
        const { t } = useTranslation(lng, "main");

        const [name, setName] = useState<null | string>(parentName);

        const handleNameChange = useCallback(
            (event: any) => {
                const { name, value } = event.target;
                if (value.length <= 10) {
                    setName(value);
                    setParentName(nameLabel, value);
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
                        className="block mb-[15px]"
                        htmlFor={nameLabel}
                    >
                        {t("rightNowActivityOrderPayment.contactName")}
                    </label>
                    <Input
                        id={nameLabel}
                        {...register(nameLabel)}
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
