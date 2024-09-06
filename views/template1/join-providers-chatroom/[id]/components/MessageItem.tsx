"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import Image from "next/image";
import dayjs from "dayjs";
import { tmc } from "@/service/utils";
import type { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import type { ChatReceiverInterface } from "@/interface/chats";

/**
 * 聊天室訊息
 */
const MessageItem = memo(({ lng, message, providerData, index }: { lng: string; message: MessageInterface; providerData: ChatReceiverInterface; index: number }) => {
    const { t } = useTranslation(lng, "main");
    return (
        <li
            key={message.id}
            className={tmc([index % 2 === 0 ? "justify-start" : "justify-end", , "mb-2 flex items-center"])}
        >
            {typeof providerData.avatar === "string" && index % 2 === 0 && (
                <Image
                    src={providerData.avatar}
                    alt="provider cover"
                    width={100}
                    height={100}
                    style={{ width: "50px", height: "auto" }}
                    className="rounded-full mr-[13px]"
                />
            )}
            <div className="flex items-end">
                {index % 2 === 0 ? (
                    <>
                        <div className={tmc(["bg-gray-light rounded-full py-[9px] px-[15px] text-gray-primary text-[15px] mr-[13px]"])}>{message.content}</div>
                        <div className="text-[12px] text-gray-third">{dayjs(message.createdAt).format("H:mm")}</div>
                    </>
                ) : (
                    <>
                        <div className="mr-[13px] text-[12px] text-gray-third">{dayjs(message.createdAt).format("H:mm")}</div>
                        <div className={tmc(["PrimaryGradient rounded-full py-[9px] px-[15px] text-white text-[15px]"])}>{message.content}</div>
                    </>
                )}
            </div>
        </li>
    );
});

export default MessageItem;
