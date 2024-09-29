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
import { RightNowActivityOrderCancelAndCancelAcceptedOrderAPI, RightNowActivityOrderCancelAPI } from "@/api/bookingAPI/bookingAPI";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

/**
 * 取消活動彈窗 ui
 */
const RightNowActivityOrderCancelModal = forwardRef(
    ({ lng, orderID, description, confirmText, confirmTextDescription, isShowCancelAcceptedOrderConfirm }: { lng: string; orderID: string; description: string; confirmText?: string | void; confirmTextDescription?: string | void; isShowCancelAcceptedOrderConfirm: boolean }, ref: any) => {
        const { t } = useTranslation(lng, "main");
        const router = useRouter();
        const [open, setOpen] = useState(false);
        const [loading, setLoading] = useState(false);
        useImperativeHandle(ref, () => ({
            openModal: () => {
                setOpen(true);
            },
        }));

        type FormValues = {
            form: {
                checkedCancelAcceptedOrder: boolean;
                orderID: string;
            };
        };

        const formSchema = {
            checkedCancelAcceptedOrder: yup.boolean(),
            orderID: yup.string(),
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
                    checkedCancelAcceptedOrder: false,
                    orderID,
                },
            },
        });

        const handleCancel = () => {
            reset();
            setOpen(false);
        };

        const onChange: CheckboxProps["onChange"] = (e) => {
            console.log(`checked = ${e.target.checked}`);
            setValue("form.checkedCancelAcceptedOrder", e.target.checked);
        };

        /**
         * 取消即刻快閃單
         */
        const rightNowActivityOrderCancel = async (id: string) => {
            try {
                const res = await RightNowActivityOrderCancelAPI(id);
                console.log("RightNowActivityOrderCancelAPI => ", res);
            } catch (err) {
                console.log("RightNowActivityOrderCancelAPI err => ", err);
                throw err;
            } finally {
                setLoading(false);
            }
        };
        /**
         * 取消即刻快閃單連同已確認的一般訂單一起取消
         */
        const rightNowActivityOrderCancelAndCancelAcceptedOrder = async (id: string) => {
            try {
                const res = await RightNowActivityOrderCancelAndCancelAcceptedOrderAPI(id);
                console.log("RightNowActivityOrderCancelAndCancelAcceptedOrderAPI => ", res);
            } catch (err) {
                console.log("RightNowActivityOrderCancelAndCancelAcceptedOrderAPI err => ", err);
                throw err;
            } finally {
                setLoading(false);
            }
        };

        /**
         * submit 成功時往下一步
         * @param data
         */
        const onSubmit: SubmitHandler<FormValues> = async (data) => {
            console.log("success form =>", data);
            setLoading(true);
            if (Object.keys(errors).length > 0) {
                return;
            }
            // 判斷是否勾選連同已確認服務商訂單一同取消
            if (data.form.checkedCancelAcceptedOrder) {
                // 連同已確認服務商訂單一同取消
                await rightNowActivityOrderCancelAndCancelAcceptedOrder(orderID);
            } else {
                // 只取消即刻快閃單
                await rightNowActivityOrderCancel(orderID);
            }
            router.push(`/rightnowactivity-order/cancel/${orderID}`);
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
                        <div className="w-full mr-[15px]">
                            <Spin
                                spinning={loading}
                                indicator={<LoadingOutlined spin />}
                            >
                                <button
                                    type="submit"
                                    onClick={handleSubmit(onSubmit, onError)}
                                    className="w-full text-gray-third border rounded-md h-[45px] border-gray-third mr-[13px]"
                                >
                                    {t("global.confirm")}
                                </button>
                            </Spin>
                        </div>
                        <div className="w-full">
                            <Spin spinning={loading}>
                                <ButtonBorderGradient
                                    onClick={handleCancel}
                                    buttonText={t("global.cancel")}
                                    outsideClassName={`PrimaryGradient p-px rounded-md flex-1 DisabledGradient`}
                                    insideClassName={`PrimaryGradient rounded-[calc(0.5rem-3px)] p-2  w-full flex items-center text-white  bg-white justify-center h-[45px]`}
                                    isDisabled={false}
                                    buttonType="button"
                                />
                            </Spin>
                        </div>
                    </form>,
                ]}
            >
                <p className="text-[#1E1E1E] text-[15px]">{description}</p>
                {isShowCancelAcceptedOrderConfirm && confirmText ? (
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
