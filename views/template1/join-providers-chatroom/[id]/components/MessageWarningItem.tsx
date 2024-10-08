"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import dayjs from "dayjs";

/**
 * 聊天室警告訊息格式
 */
const MessageWarningItem = memo(({ lng, message }: { lng: string; message: MessageInterface }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    // 登入者 id
    const userID = userBananaIdSelector(userStore);
    return (
        <li className="flex justify-center items-end">
            {message.userId === userID && <div className="mr-[13px] text-[12px] text-gray-third">{dayjs(message.createdAt).format("MM/DD HH:mm")}</div>}
            <div className="mt-3 flex-1 px-5 py-2 mx-auto text-[10px] text-center text-white">
                <span className="bg-red-500 px-5 py-2  rounded-lg">{message.content}</span>
            </div>
            {message.userId !== userID && <div className="text-right ml-[13px] text-[12px] text-gray-third">{dayjs(message.createdAt).format("MM/DD HH:mm")}</div>}
        </li>
    );
});

export default MessageWarningItem;
