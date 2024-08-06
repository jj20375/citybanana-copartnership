"use client";
import { useForm, Controller, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles/HeaderLoginInputDatepicker.module.scss";
import * as yup from "yup";
import dayjs from "dayjs";
import { addYears } from "date-fns";
import { countryCodes } from "@/config/country-codes.config";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { formPhoneValiation, formPasswordValiation, formCheckPhoneHaveFirstZero, formCheckCountryCodeResetPhoneValidation } from "@/service/form-validate";

type FormValues = {
    form: {
        countryCode: string;
        phone: string;
        password: string;
    };
};

// 設置最小日期為 18 年前
const eighteenYearsAgo = addYears(new Date(), -18);

export default async function HeaderLoginInput() {
    const { t } = useTranslation("zh-TW", "main");
    const formSchema = {
        countryCode: yup.string().required("國家代碼為必填"),
        phone: formPhoneValiation({ requiredMessage: t("phoneValidation.phoneInput.validation.phone_requiredErrMessage"), matchMessage: t("phoneValidation.phoneInput.validation.phone_matchErrMessage") }),
        password: formPasswordValiation,
    };
    const [schema, setSchema]: any = useState(
        yup
            .object()
            .shape({
                form: yup.object().shape(formSchema),
            })
            .required()
    );

    const {
        register,
        control,
        handleSubmit,
        watch,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            form: {
                countryCode: "886",
            },
        },
    });

    console.log("input login =>", getValues());
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("success form =>", data);
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    const phoneValue = watch("form.phone");
    const countryCode = watch("form.countryCode");

    useEffect(() => {
        setValue("form.phone", formCheckPhoneHaveFirstZero({ phoneValue, countryCode }));
    }, [countryCode, phoneValue]);

    useEffect(() => {
        setSchema(
            yup
                .object()
                .shape({
                    form: yup.object().shape(formCheckCountryCodeResetPhoneValidation({ countryCode, formSchema })),
                })
                .required()
        );
    }, [countryCode]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-2"
        >
            <select {...register("form.countryCode")}>
                <option value="">請選擇國家</option>
                {countryCodes.map((country) => (
                    <option
                        key={country.value}
                        value={country.value}
                    >
                        +{country.value}
                    </option>
                ))}
            </select>
            {errors.form?.countryCode && <p className="text-red-500">{errors.form?.countryCode.message}</p>}
            <input
                type="text"
                {...register("form.phone")}
                placeholder="請輸入手機號碼"
                className="border-b border-gray-400"
            />
            {errors.form?.phone && <p className="text-red-500">{errors.form?.phone.message}</p>}
            <input
                type="password"
                {...register("form.password")}
                placeholder="請輸入密碼"
                className="border-b border-gray-400"
            />
            {errors.form?.password && <p className="text-red-500">{errors.form?.password.message}</p>}
            <button
                type="submit"
                className="p-2 border border-gray-300 rounded"
            >
                Submit
            </button>
        </form>
    );
}
