"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import { Image } from "antd";

/**
 * 聊天室圖片訊息格式
 */
const MessageImageItem = memo(({ lng, message }: { lng: string; message: MessageInterface }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    // 登入者 id
    const userID = userBananaIdSelector(userStore);

    return (
        <div className={tmc(["leading-none whitespace-pre-line rounded-lg", message.userId === userID ? "mr-2 bg-gradient-to-b from-blue-600 to-blue-700 text-white" : "ml-2 bg-white"])}>
            <Image
                width={200}
                src={message.content}
            />
        </div>
    );
});

export default MessageImageItem;
