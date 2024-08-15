"use client";

import { Modal, Select } from "antd";
import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { rightNowActivityProviderMaxRequiredSelector } from "@/store-toolkit/stores/orderStore";
import ButtonBorderGradient from "../../components/ButtonBorderGradient";
import { useTranslation } from "@/i18n/i18n-client";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../styles/RightNowActivityOrderChangeRequiredProviderCountModal.module.scss";
import { Trans } from "react-i18next";
const { Option } = Select;

/**
 * 增加活動需求人數彈窗 ui
 */
const AddRequiredProviderCountModal = forwardRef(({ lng, currentProviderCount, orderId }: { lng: string; currentProviderCount: number; orderId: string }, ref: any) => {
    type FormValues = {
        form: {
            requriedProviderCount: number;
            orderId: string;
        };
    };
    const { t } = useTranslation(lng, "main");
    const state = useAppSelector((state) => state.orderStore);
    const [open, setOpen] = useState(false);
    const [providerCount, setProviderCount] = useState(currentProviderCount);
    const minRequired = currentProviderCount;
    const maxRequired = rightNowActivityProviderMaxRequiredSelector(state);

    const formSchema = {
        requriedProviderCount: yup.number(),
        orderId: yup.string(),
    };

    const [schema, setSchema]: any = useState(
        yup
            .object()
            .shape({
                form: yup.object().shape(formSchema),
            })
            .required()
    );

    const options = Array.from({ length: maxRequired }, (_, i) => i + currentProviderCount);

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
                requriedProviderCount: providerCount,
                orderId,
            },
        },
    });

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
        },
    }));

    const handleCancel = () => {
        setOpen(false);
    };

    const handleRequiredProviderCount = (val: number) => {
        setProviderCount(val);
    };

    /**
     * submit 成功時往下一步
     * @param data
     */
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("success form =>", data);
        if (Object.keys(errors).length > 0) {
            return;
        }
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    return (
        <Modal
            title={<div></div>}
            open={open}
            centered
            className={`${styles["change-required-provider-count"]}`}
            maskClosable
            onCancel={handleCancel}
            footer={[
                <form
                    key="form"
                    onSubmit={handleSubmit(onSubmit, onError)}
                >
                    <div className="flex w-full">
                        <button
                            type="button"
                            className="w-full  text-gray-third border rounded-md h-[45px] border-gray-third mr-[13px]"
                            onClick={handleCancel}
                        >
                            {t("global.cancel")}
                        </button>
                        <ButtonBorderGradient
                            onClick={onSubmit}
                            buttonText={t("global.confirm")}
                            outsideClassName={`PrimaryGradient p-px rounded-md flex-1 DisabledGradient`}
                            insideClassName={`PrimaryGradient rounded-[calc(0.5rem-3px)] p-2  w-full flex items-center text-white  bg-white justify-center h-[45px]`}
                            isDisabled={false}
                            buttonType="submit"
                        />
                    </div>
                </form>,
            ]}
        >
            <label
                htmlFor=""
                className="block text-[15px] text-[#1e1e1e] mb-[10px]"
            >
                {t("rightNowActivityOrderDetail.recruitment.label-changeRequiredProviderCount")}：
            </label>
            <Select
                defaultValue={currentProviderCount}
                value={providerCount}
                onChange={handleRequiredProviderCount}
            >
                {options.map((value) => (
                    <Option
                        key={value}
                        value={value}
                    >
                        {t("rightNowActivityOrder.requiredProviderCount.requiredCount", { count: value })}
                    </Option>
                ))}
            </Select>
            <Trans
                t={t}
                i18nKey={"rightNowActivityOrderDetail.recruitment.modalDescription"}
                values={{ val: 60 }}
            >
                123
            </Trans>
            <p className="text-center mt-[10px] text-gray-third text-sm-content">{"(" + t("rightNowActivityOrderDetail.recruitment.modalDescription", { val: 60 }) + ")"}</p>
        </Modal>
    );
});

export default AddRequiredProviderCountModal;
