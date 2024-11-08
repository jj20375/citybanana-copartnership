"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import Image from "next/image";
import dayjs from "dayjs";
import { tmc } from "@/service/utils";
import type { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import type { ChatReceiverInterface } from "@/interface/chats";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";

/**
 * 聊天室訊息
 */
const MessageItem = memo(({ lng, message, providerData, index }: { lng: string; message: MessageInterface; providerData: ChatReceiverInterface; index: number }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    // 登入者 id
    const userID = userBananaIdSelector(userStore);
    // 客服 id
    const serviceChatID = process.env.NEXT_PUBLIC_SERVICE_CHAT_ID;

    return (
        <li
            key={message.id}
            className={tmc([message.userId === userID ? "justify-end" : "justify-start", "flex items-start mt-3"])}
        >
            {typeof providerData.avatar === "string" && message.userId !== userID && message.userId !== serviceChatID && (
                <Image
                    src={providerData.avatar}
                    alt="provider cover"
                    width={50}
                    height={50}
                    style={{ width: "25px", height: "auto" }}
                    className="rounded-full mr-[13px]"
                />
            )}
            {message.userId === serviceChatID && (
                <Image
                    src="/img/logos/logo_type1.svg"
                    alt="provider cover"
                    width={50}
                    height={50}
                    style={{ width: "25px", height: "auto" }}
                    className="rounded-full mr-[13px]"
                />
            )}
            <div className="flex items-end">
                {message.userId !== userID ? (
                    <>
                        <div className={tmc(["bg-white rounded-md py-[9px] px-[15px] text-gray-primary text-sm mr-[13px]"])}>{message.content}</div>
                        <div className="text-[12px] text-gray-third">{dayjs(message.createdAt).format("MM/DD HH:mm")}</div>
                    </>
                ) : (
                    <>
                        <div className="mr-[13px] text-[12px] text-gray-third">
                            {typeof providerData.readedAt === "number" && providerData.readedAt > message.createdAt && <div>已讀</div>}
                            {dayjs(message.createdAt).format("MM/DD HH:mm")}
                        </div>
                        <div className={tmc(["bg-gradient-to-b from-blue-600 to-blue-700 text-white rounded-md py-[9px] px-[15px] text-white text-sm"])}>{message.content}</div>
                    </>
                )}
            </div>
        </li>
    );
});

export default MessageItem;
