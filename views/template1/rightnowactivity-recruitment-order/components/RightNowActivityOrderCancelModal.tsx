"use client";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Checkbox } from "antd";
import { useTranslation } from "@/i18n/i18n-client";
import ButtonBorderGradient from "../../components/ButtonBorderGradient";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import type { CheckboxProps } from "antd";
import { useRouter } from "next/navigation";

/**
 * 取消活動彈窗 ui
 */
const RightNowActivityOrderCancelModal = forwardRef(
    ({ lng, orderId, description, needConfirm, confirmText, confirmTextDescription }: { lng: string; orderId: string; description: string; needConfirm?: boolean | void; confirmText?: string | void; confirmTextDescription?: string | void }, ref: any) => {
        const { t } = useTranslation(lng, "main");
        const router = useRouter();
        const [open, setOpen] = useState(false);
        useImperativeHandle(ref, () => ({
            openModal: () => {
                setOpen(true);
            },
        }));

        type FormValues = {
            form: {
                checkedCancel: boolean;
                orderId: string;
            };
        };

        const formSchema = {
            checkedCancel: yup.boolean(),
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
                    checkedCancel: false,
                    orderId,
                },
            },
        });

        const handleCancel = () => {
            reset();
            setOpen(false);
        };

        const onChange: CheckboxProps["onChange"] = (e) => {
            console.log(`checked = ${e.target.checked}`);
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
            router.push("/rightnowactivity-order/cancel/1");
            setOpen(false);
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
                maskClosable
                onCancel={handleCancel}
                footer={[
                    <form
                        key="form"
                        className="flex"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <button
                            type="submit"
                            onClick={handleSubmit(onSubmit, onError)}
                            className="w-full  text-gray-third border rounded-md h-[45px] border-gray-third mr-[13px]"
                        >
                            {t("global.confirm")}
                        </button>
                        <ButtonBorderGradient
                            onClick={handleCancel}
                            buttonText={t("global.cancel")}
                            outsideClassName={`PrimaryGradient p-px rounded-md flex-1 DisabledGradient`}
                            insideClassName={`PrimaryGradient rounded-[calc(0.5rem-3px)] p-2  w-full flex items-center text-white  bg-white justify-center h-[45px]`}
                            isDisabled={false}
                            buttonType="button"
                        />
                    </form>,
                ]}
            >
                <p className="text-[#1E1E1E] text-[15px]">{description}</p>
                {needConfirm && confirmText ? (
                    <Checkbox onChange={onChange}>
                        <p className="text-[13px] text-gray-primary mt-[15px]">{confirmText}</p>
                        {typeof confirmTextDescription === "string" && <div className="text-primary text-[12px]">{confirmTextDescription}</div>}
                    </Checkbox>
                ) : null}
            </Modal>
        );
    }
);

export default RightNowActivityOrderCancelModal;
