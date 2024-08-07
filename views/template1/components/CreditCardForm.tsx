"use client";
import { useTranslation } from "@/i18n/i18n-client";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "antd";
import { CreditCardDataInterface } from "@/interface/global";
import { formatCardExpiryDate, formatCardNumber, isEmpty } from "@/service/utils";
import { useCallback, useEffect, useState, memo } from "react";
import styles from "@/styles/CreditCardForm.module.scss";
/**
 * 信用卡表單 ui
 * @param { type String(字串) } lng 語系
 * @returns
 */

const CreditCardForm = memo(({ lng, required, customClass }: { lng: string; required: boolean; customClass?: string | void }) => {
    const { t } = useTranslation(lng, "main");

    type FormValues = CreditCardDataInterface;

    const formSchema = {
        cardNo: yup
            .string()
            .required("請輸入信用卡卡號")
            .transform((value, originalValue) => {
                return value.replace(/-/g, "");
            })
            .test("is-cardNo-verify", "信用卡格式錯誤", function (val) {
                if (typeof val !== "string") {
                    return false;
                }
                const cardNo = val.replace(/-/g, "");
                if (cardNo.length < 16) {
                    return false;
                }
                return true;
            }),
        exp: yup
            .string()
            .required("信用卡到期日為必填")
            .transform((value, originalValue) => {
                return value.replace(/\//g, "");
            })
            .test("is-card-expiry-date", "信用卡有效日期格式錯誤", function (val) {
                if (typeof val !== "string") {
                    return false;
                }
                if (val.length < 4) {
                    return false;
                }
                return true;
            }),
        cvc: yup
            .string()
            .required("安全碼為必填")
            .test("is-card-cvc", "信用卡安全碼格式錯誤", function (val) {
                if (typeof val !== "string") {
                    return false;
                }
                if (val.length < 3) {
                    return false;
                }
                return true;
            }),
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
        clearErrors,
        reset,
        trigger,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            form: {
                cardNo: "",
                exp: "",
                cvc: "",
            },
        },
    });

    const cardNoValue = watch("form.cardNo");
    const expValue = watch("form.exp");
    const cvcValue = watch("form.cvc");

    // 信用卡卡號輸入框值更新時觸發
    const handleCardNoChange = useCallback(
        (event: any) => {
            const { name, value } = event.target;
            if (value.length > 19) {
                return;
            }
            if (!isEmpty(value)) {
                setValue("form.cardNo", formatCardNumber(value));
            } else {
                setValue("form.cardNo", value);
            }
        },
        [cardNoValue]
    );
    // 信用卡有效日期輸入框值更新時觸發
    const handleCardExpiryDateChange = useCallback(
        (event: any) => {
            const { name, value } = event.target;
            if (value.length > 5) {
                return;
            }
            if (!isEmpty(value)) {
                setValue("form.exp", formatCardExpiryDate(value));
            } else {
                setValue("form.exp", value);
            }
        },
        [expValue]
    );
    // 信用卡安全碼輸入框值更新時觸發
    const handleCardCvcChange = useCallback(
        (event: any) => {
            let { name, value } = event.target;
            // 移除非數字字串
            value = value.replace(/[^\d]/g, "");

            if (value.length > 3) {
                return;
            }
            setValue("form.cvc", value);
        },
        [cvcValue]
    );
    /**
     * submit 成功時往下一步
     * @param data
     */
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("success form =>", data);
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };
    return (
        <div className={`border border-gray-primary rounded-md p-[17px] ${customClass} ${styles["credit-card-form"]}`}>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <section className="flex flex-col">
                    <label
                        htmlFor="form.cardNo"
                        className="mb-[8px]"
                    >
                        {t("creditCardForm.cardNo.label")}
                        {required && <span className="text-primary">*</span>}
                    </label>
                    <Input
                        {...register("form.cardNo")}
                        id="form.cardNo"
                        name="form.cardNo"
                        type="text"
                        value={cardNoValue}
                        onChange={handleCardNoChange}
                    />
                </section>
                <section className="flex mt-[10px]">
                    <div className="flex flex-col flex-1 mr-[14px]">
                        <label
                            htmlFor="form.exp"
                            className="mb-[8px]"
                        >
                            {t("creditCardForm.exp.label")}
                            {required && <span className="text-primary">*</span>}
                        </label>
                        <Input
                            {...register("form.exp")}
                            id="form.exp"
                            name="form.exp"
                            type="text"
                            value={expValue}
                            onChange={handleCardExpiryDateChange}
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label
                            htmlFor="form.cvc"
                            className="mb-[8px]"
                        >
                            {t("creditCardForm.cvc.label")}
                            {required && <span className="text-primary">*</span>}
                        </label>
                        <Input
                            {...register("form.cvc")}
                            id="form.cvc"
                            name="form.cvc"
                            type="text"
                            value={cvcValue}
                            onChange={handleCardCvcChange}
                        />
                    </div>
                </section>
                {/* <button type="submit">submit</button> */}
            </form>
        </div>
    );
});
export default CreditCardForm;
