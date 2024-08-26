"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { MessageInterface, ProviderDataByChatRoomInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import Image from "next/image";
import dayjs from "dayjs";
import { tmc } from "@/service/utils";

/**
 * 聊天室訊息
 */
const MessageItem = memo(({ lng, message, providerData, index }: { lng: string; message: MessageInterface; providerData: ProviderDataByChatRoomInterface; index: number }) => {
    const { t } = useTranslation(lng, "main");
    return (
        <li
            key={message.id}
            className={tmc([index % 2 === 0 ? "justify-start" : "justify-end", , "mb-2 flex items-center"])}
        >
            {typeof providerData.cover === "string" && index % 2 === 0 && (
                <Image
                    src={providerData.cover}
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
                        <span>{dayjs(message.createdAt).format("H:mm")}</span>
                    </>
                ) : (
                    <>
                        <div className="mr-[13px]">{dayjs(message.createdAt).format("H:mm")}</div>
                        <span className={tmc(["PrimaryGradient rounded-full py-[9px] px-[15px] text-white text-[15px]"])}>{message.content}</span>
                    </>
                )}
            </div>
        </li>
    );
});

export default MessageItem;
