"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import { Image } from "antd";
import { ChatReceiverInterface } from "@/interface/chats";

/**
 * 聊天室圖片訊息格式
 */
const MessageImageItem = memo(({ lng, message, providerData }: { lng: string; message: MessageInterface; providerData: ChatReceiverInterface }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    // 登入者 id
    const userID = userBananaIdSelector(userStore);

    return (
        <li
            key={message.id}
            className={tmc([message.userId === userID ? "justify-end" : "justify-start", "flex items-center mt-3"])}
        >
            {typeof providerData.avatar === "string" && message.userId !== userID && (
                <Image
                    src={providerData.avatar}
                    alt="provider cover"
                    width={100}
                    height={100}
                    style={{ width: "25px", height: "auto" }}
                    className="rounded-full mr-[13px]"
                />
            )}
            <div className={tmc(["mt-3 leading-none whitespace-pre-line rounded-lg", message.userId === userID ? "mr-2 bg-gradient-to-b from-blue-600 to-blue-700 text-white" : "ml-2 bg-white"])}>
                <Image
                    width={200}
                    src={message.content}
                />
            </div>
        </li>
    );
});

export default MessageImageItem;
