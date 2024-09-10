"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";

/**
 * 聊天室警告訊息格式
 */
const MessageWarningItem = memo(({ lng, message }: { lng: string; message: MessageInterface }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    // 登入者 id
    const userID = userBananaIdSelector(userStore);
    return (
        <div className="px-5 py-2 mx-auto text-xs text-center text-white bg-red-500 rounded-lg">
            <span>{message.content}</span>
        </div>
    );
});

export default MessageWarningItem;
