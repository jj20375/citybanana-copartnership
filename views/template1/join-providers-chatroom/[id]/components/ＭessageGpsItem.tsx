"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import { ChatReceiverInterface } from "@/interface/chats";
import Image from "next/image";
import dayjs from "dayjs";

/**
 * 聊天室gps訊息格式 ui
 */
const MessageGpsItem = memo(({ lng, message, providerData }: { lng: string; message: MessageInterface; providerData: ChatReceiverInterface }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    // 登入者 id
    const userID = userBananaIdSelector(userStore);

    return (
        <li
            key={message.id}
            className={tmc([message.userId === userID ? "justify-end" : "justify-start", "flex items-end mt-3"])}
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
            {message.userId === userID && <div className="mr-[13px] text-[12px] text-gray-third">{dayjs(message.createdAt).format("MM/DD HH:mm")}</div>}

            <div className={tmc(["px-3 mt-3 text-sm shadow-xl whitespace-pre-line break-all rounded-lg  max-w-[75%]", message.userId === userID ? "mr-2 bg-gradient-to-b text-white from-blue-600 to-blue-700" : "ml-2 bg-white"])}>
                <div className="text-center my-2">
                    <a
                        href={`https://www.google.com/maps?q=${message.lat},${message.long}&hl=zh-TW&z=16`}
                        target="gmap"
                    >
                        <i className="fas fa-map-marker-alt text-xl mr-2"></i> 點擊查看地點
                    </a>
                </div>
            </div>
            {message.userId !== userID && <div className="ml-[13px] text-[12px] text-gray-third">{dayjs(message.createdAt).format("MM/DD HH:mm")}</div>}
        </li>
    );
});

export default MessageGpsItem;
