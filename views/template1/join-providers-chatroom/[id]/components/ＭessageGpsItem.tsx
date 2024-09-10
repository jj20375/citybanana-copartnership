"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";

/**
 * 聊天室gps訊息格式 ui
 */
const MessageGpsItem = memo(({ lng, message }: { lng: string; message: MessageInterface }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    // 登入者 id
    const userID = userBananaIdSelector(userStore);

    return (
        <div className={tmc(["px-3 text-sm shadow-xl max-w-[75%] whitespace-pre-line break-all rounded-lg", message.userId === userID ? "mr-2 bg-gradient-to-b text-white from-blue-600 to-blue-700" : "ml-2 bg-white"])}>
            <div className="text-center my-2">
                <a
                    href={`https://www.google.com/maps?q=${message.lat},${message.long}&hl=zh-TW&z=16`}
                    target="gmap"
                >
                    <i className="fas fa-map-marker-alt text-xl mr-2"></i> 點擊查看地點
                </a>
            </div>
        </div>
    );
});

export default MessageGpsItem;
