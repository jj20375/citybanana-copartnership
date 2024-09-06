"use client";

import { forwardRef, useState, useImperativeHandle, useCallback, useEffect } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useForm, Controller, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "antd";
import useSWR from "swr";
import { SendChatMessageAPI } from "@/api/chatAPI";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { useParams } from "next/navigation";
import { firebaseDbDoc, firebaseDb } from "@/lib/firebase/firebase-hooks";
import { ChatReceiverInterface } from "@/interface/chats";
import { UserProfileInterface } from "@/interface/user";

const { TextArea } = Input;

/**
 * 發送聊天室訊息 ui
 */
const SendMessage = forwardRef(({ lng }: { lng: string }, ref: any) => {
    const { t } = useTranslation(lng, "main");
    const params: { receiverId: string } | null = useParams();
    const userStore = useAppSelector((state) => state.userStore);
    const chatStore = useAppSelector((state) => state.chatStore);

    // 登入者 id
    const loginUserId = userBananaIdSelector(userStore);
    // 聊天對象 id
    const receiverId = params?.receiverId;
    // 聊天對象資料
    const chatReceiver = chatStore.chatReceiver;

    type FormValues = {
        message: string;
    };

    const formSchema = {
        message: yup
            .string()
            .min(2, t("rightNowActivityJoinProvidersChatRoom.validation.message_minErrMessage", { val: 2 }))
            .required(t("rightNowActivityJoinProvidersChatRoom.validation.message_requiredErrMessage")),
    };

    const [form, setForm] = useState<FormValues>({ message: "" });

    const [schema, setSchema]: any = useState(yup.object(formSchema).required());

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
            message: "",
        },
    });

    const messageValue = watch("message");
    /**
     * 發送聊天室鐔
     * @param param0
     */
    const sendMessage = async ({ message }: { message: string }) => {
        if (chatReceiver?.id && chatReceiver?.name) {
            try {
                await SendChatMessageAPI({
                    receiveUserId: chatReceiver.id,
                    receiveUserName: chatReceiver.name,
                    loginUserId,

                    message,
                    isProvider: false,
                });
            } catch (err) {
                throw { title: "sendMessageAPI err =>", err };
            }
        }
    };

    /**
     * submit 成功時往下一步
     * @param data
     */
    const onSubmit: SubmitHandler<FormValues | any> = async (data) => {
        console.log("success form =>", data);
        await sendMessage(data);
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    // 手動觸發表單驗證
    const handleManualValidation = async () => {
        const result = await trigger();
        if (result) {
            onSubmit(form);
        } else {
            onError(errors);
            console.log("Validation failed", errors);
        }
    };

    const handleMessageOnChange = useCallback(
        (event: any) => {
            const { name, value } = event.target;
            setValue("message", value);
            setForm({ message: value });
        },
        [form]
    );

    useImperativeHandle(ref, () => ({
        onSendMessage: handleManualValidation,
    }));

    return (
        <form
            className="w-full"
            onSubmit={handleSubmit(onSubmit, onError)}
        >
            <TextArea
                className=" items-center flex"
                placeholder={t("rightNowActivityJoinProvidersChatRoom.input-placeholder") + "..."}
                style={{ height: 46 }}
                value={form.message}
                onChange={handleMessageOnChange}
            />
        </form>
    );
});

export default SendMessage;
