"use client";
import { forwardRef, useImperativeHandle, useState, useMemo, useEffect } from "react";
import { Modal, Checkbox } from "antd";
import { useTranslation } from "@/i18n/i18n-client";
import ButtonBorderGradient from "../../components/ButtonBorderGradient";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "../rightnowactivity-order-interface";
import { RightNowActivityOrderChooseProvidersToPaymentAndCreateOrdersAPI } from "@/api/bookingAPI/bookingAPI";

/**
 * 確認付款彈窗 ui
 */
const RightNowActivityOrderConfirmPaymentModal = forwardRef(({ lng, orderID, providers, providerIds }: { lng: string; orderID: string; providers: RightNowActivityOrderDetailProviderSigupCardInterface[]; providerIds?: string[] | void }, ref) => {
    const router = useRouter();
    const { t } = useTranslation(lng, "main");
    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
        },
    }));

    type FormValues = {
        form: {
            providerIds: string[];
            orderID: string;
        };
    };

    const formSchema = {
        providerIds: yup.array(),
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

    // 選擇服務商名稱
    const chooseNames = useMemo(() => {
        if (Array.isArray(providerIds)) {
            return providers
                .filter((provider: RightNowActivityOrderDetailProviderSigupCardInterface) => providerIds.includes(provider.id as string))
                .map((provider: RightNowActivityOrderDetailProviderSigupCardInterface) => provider.name)
                .join(", ");
        }
        return "";
    }, [providerIds]);

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
                providerIds: [],
                orderID,
            },
        },
    });

    const handleCancel = () => {
        reset();
        setOpen(false);
    };

    // 下一步按鈕事件
    const onNextStepButtonClick = (orderID: string) => {
        reset();
        router.push(`/pay-working/${orderID}`);
        return;
    };

    /**
     * 即刻快閃選擇服務商並付款
     */
    const handleConfirmPayment = async (ids: string[]) => {
        try {
            const res = await RightNowActivityOrderChooseProvidersToPaymentAndCreateOrdersAPI({ ids });
            console.log("choose providers to payment and create orders API success =>", res);
        } catch (err) {
            console.error("choose providers to payment and create orders API error =>", err);
            // 處理錯誤
            throw err;
        }
    };

    /**
     * submit 成功時往下一步
     * @param data
     */
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log("success form =>", data);
        if (Object.keys(errors).length > 0) {
            return;
        }
        console.log("data.form. =>", data.form, getValues("form.providerIds"));
        await handleConfirmPayment(data.form.providerIds);
        // onNextStepButtonClick(orderID);
        return;
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    useEffect(() => {
        if (Array.isArray(providerIds)) {
            setValue("form.providerIds", providerIds);
        }
    }, [providerIds]);

    return (
        <Modal
            title={<div></div>}
            open={open}
            centered
            maskClosable
            onCancel={handleCancel}
            closable={false}
            footer={[]}
        >
            <form
                key="form"
                onSubmit={handleSubmit(onSubmit, onError)}
            >
                <div className="text-[#1E1E1E] text-[15px]">
                    <span>{t("paymentConfirm.confirm-1")}</span>
                    {Array.isArray(providerIds) && <strong className="text-primary">「{chooseNames}」</strong>}
                    <span>{t("paymentConfirm.confirm-2")}</span>
                    <p>{t("paymentConfirm.confirm-3")}</p>
                </div>
                <div className="flex mt-[15px]">
                    <button
                        type="button"
                        className="w-full  text-gray-third border rounded-md h-[45px] border-gray-third mr-[13px]"
                        onClick={handleCancel}
                    >
                        {t("global.cancel")}
                    </button>
                    <ButtonBorderGradient
                        onClick={handleSubmit(onSubmit, onError)}
                        buttonText={t("global.confirm")}
                        outsideClassName={`PrimaryGradient p-px rounded-md flex-1 DisabledGradient`}
                        insideClassName={`PrimaryGradient rounded-[calc(0.5rem-3px)] p-2  w-full flex items-center text-white  bg-white justify-center h-[45px]`}
                        isDisabled={false}
                        buttonType="submit"
                    />
                </div>
            </form>
        </Modal>
    );
});

export default RightNowActivityOrderConfirmPaymentModal;
