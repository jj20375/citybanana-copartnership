"use client";

import { Modal, Select } from "antd";
import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { rightNowActivityProviderMaxRequiredSelector } from "@/store-toolkit/stores/orderStore";
import ButtonBorderGradient from "../../components/ButtonBorderGradient";
import { useTranslation } from "@/i18n/i18n-client";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../styles/RightNowActivityOrderChangeRequiredProviderCountModal.module.scss";
import { Trans } from "react-i18next";
import { ChangeRightNowActivityProviderRequiredAPI } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI";
import { ChangeRightNowActivityProviderRequiredAPIReqInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
const { Option } = Select;

/**
 * 增加活動需求人數彈窗 ui
 */
const AddRequiredProviderCountModal = forwardRef(({ lng, currentProviderCount, orderID, getOrder }: { lng: string; currentProviderCount: number; orderID: string; getOrder?: Function | void }, ref: any) => {
    type FormValues = {
        form: {
            requiredProviderCount: number;
            orderID: string;
        };
    };
    const { t } = useTranslation(lng, "main");
    const [loading, setLoading] = useState(false);
    const state = useAppSelector((state) => state.orderStore);
    const [open, setOpen] = useState(false);
    const [providerCount, setProviderCount] = useState(currentProviderCount + 1);
    const minRequired = currentProviderCount;
    const maxRequired = rightNowActivityProviderMaxRequiredSelector(state);
    // 動態即刻快閃招募時間
    const rightNowActivityNowTimeDueAtMinute = process.env.NEXT_PUBLIC_NOW_TIME_DUE_AT_MINUTE;

    const formSchema = {
        requiredProviderCount: yup.number(),
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
                requiredProviderCount: providerCount,
                orderID,
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

    const router = useRouter();
    const pathname = usePathname();

    const onNextStepButtonClick = () => {
        reset();
        // 判斷是等待服務商報名頁面中去更改需求人數時 觸發 需重須取得即刻快閃單資料
        if (pathname === `/${lng}/rightnowactivity-recruitment-order/${orderID}` && getOrder) {
            getOrder(orderID);
            return;
        }
        // 如果在開單成功後再修改訂單需求人數時 導頁回去 等待服務商報名畫面
        router.push(`/rightnowactivity-recruitment-order/${orderID}`);
    };

    /**
     * 更改服務商數量
     * @param data
     */
    const updateProviderRequiredCount = async (data: ChangeRightNowActivityProviderRequiredAPIReqInterface) => {
        setLoading(true);
        try {
            const res = await ChangeRightNowActivityProviderRequiredAPI(data);
            console.log("ChangeRightNowActivityProviderRequiredAPI res =>", res);
            setOpen(false);
            onNextStepButtonClick();
        } catch (err) {
            console.log("ChangeRightNowActivityProviderRequiredAPI err =>", err);
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
        if (Object.keys(errors).length > 0) {
            return;
        }
        await updateProviderRequiredCount({
            orderID,
            provider_required: providerCount,
        });
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
                {t("rightNowActivityOrderRecruitmentDetail.recruitment.label-changeRequiredProviderCount")}：
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
                        disabled={value === currentProviderCount}
                    >
                        {t("rightNowActivityOrder.requiredProviderCount.requiredCount", { count: value })}
                    </Option>
                ))}
            </Select>

            <p className="text-center mt-[10px] text-gray-third text-sm-content">
                {t("rightNowActivityOrderRecruitmentDetail.recruitment.changeRequiredProviderCount-modalDescription")}
                <strong className="text-primary ml-2">
                    {rightNowActivityNowTimeDueAtMinute}
                    {t("global.minute")}
                </strong>
            </p>
        </Modal>
    );
});

export default AddRequiredProviderCountModal;
