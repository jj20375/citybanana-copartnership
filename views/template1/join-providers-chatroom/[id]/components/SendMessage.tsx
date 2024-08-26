"use client";

import { forwardRef, useState, useImperativeHandle } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useForm, Controller, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "antd";

/**
 * 發送聊天室訊息 ui
 */
const SendMessage = forwardRef(({ lng }: { lng: string }, ref: any) => {
    const { t } = useTranslation(lng, "main");

    type FormValues = {
        form: {
            message: string;
        };
    };

    const formSchema = yup.object({
        message: yup.string().required(t("rightNowActivityJoinProvidersChatRoom.validation.message_requiredErrMessage")),
    });

    const [schema, setSchema]: any = useState(
        yup
            .object()
            .shape({
                form: formSchema,
            })
            .required()
    );

    const {
        reset,
        register,
        control,
        handleSubmit,
        watch,
        getValues,
        setValue,
        clearErrors,
        trigger,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            form: {
                message: "",
            },
        },
    });

    const messageValue = watch("form.message");

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

    useImperativeHandle(ref, () => ({
        onSendMessage: () => {
            onSubmit({ form: { message: messageValue } });
        },
    }));
    return (
        <form
            className="w-full"
            onSubmit={handleSubmit(onSubmit, onError)}
        >
            <Input
                className="h-[46px]"
                placeholder={t("rightNowActivityJoinProvidersChatRoom.input-placeholder") + "..."}
                value={messageValue}
            />
        </form>
    );
});

export default SendMessage;
