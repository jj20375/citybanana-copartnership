"use client";
import { useState, useCallback, memo } from "react";
import { Input, Select } from "antd";
import styles from "./styles/PhoneInput.module.scss";
import { countryCodes } from "@/config/country-codes.config";
import { useTranslation } from "@/i18n/i18n-client";
import type { UseFormRegister, Path } from "react-hook-form";
import { PhoneValidationInterface } from "../phone-validation-interface";
const { Option } = Select;
/**
 * 手機號碼輸入框 ui
 * @param param0
 * @returns
 */

const PhoneInput = memo(
    ({
        lng,
        register,
        phoneLabel,
        countryCodeLabel,
        parentPhone,
        parentCountryCode,
        setParentPhone,
        setParentCountryCode,
    }: {
        lng: string;
        register: UseFormRegister<PhoneValidationInterface>;
        phoneLabel: Path<PhoneValidationInterface>;
        countryCodeLabel: Path<PhoneValidationInterface>;
        parentPhone: string;
        parentCountryCode: string;
        setParentPhone: Function;
        setParentCountryCode: Function;
    }) => {
        const { t } = useTranslation(lng, "main");
        const [phone, setPhone] = useState<null | string>(parentPhone);

        const handlePhoneChagne = useCallback(
            (event: any) => {
                const { name, value } = event.target;
                setPhone(value);
                setParentPhone(phoneLabel, value);
            },
            [phone]
        );
        const [countryCode, setCountryCode] = useState<null | string>(parentCountryCode);

        const handleCountryCodeChagne = useCallback(
            (val: string) => {
                setCountryCode(val);
                setParentCountryCode(countryCodeLabel, val);
            },
            [countryCode]
        );

        const selectBefore = (
            <Select
                {...register(countryCodeLabel)}
                defaultValue="886"
                value={countryCode}
                onChange={handleCountryCodeChagne}
            >
                {countryCodes.map((code) => (
                    <Option
                        key={code.value}
                        value={code.value}
                    >
                        {code.value}
                    </Option>
                ))}
            </Select>
        );
        return (
            <Input
                {...register(phoneLabel)}
                name="phone"
                addonBefore={selectBefore}
                className={styles["phone-input"]}
                onChange={handlePhoneChagne}
            />
        );
    }
);

export default PhoneInput;
