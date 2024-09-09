"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import { areasTW } from "@/config/area-tw.config";

export const MessageVorderItem = memo(({ lng, message }: { lng: string; message: MessageInterface }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    // 登入者 id
    const userID = userBananaIdSelector(userStore);

    return (
        <div className={tmc(["cursor-pointer rounded-lg px-3 py-1.5 text-sm shadow-xl", message.userId === userID ? "mr-2 bg-blue-500 text-white" : "ml-2 bg-white"])}>
            <div className="flex">
                <span className="flex-1">已發送預訂諮詢，內容如下：</span>
            </div>
            <p>開始時間：{message.orderData?.startedAt}</p>
            {message.orderData?.endedAt && <p>結束時間：{message.orderData?.endedAt}</p>}
            {message.orderData && message.orderData.district !== undefined && message.orderData.location !== undefined ? (
                <p>
                    會面地點：{areasTW[message.orderData.district].name} | {message.orderData?.location}
                </p>
            ) : null}
            <p>活動內容：{message.orderData?.description}</p>
            <p className="mt-2 text-base font-bold">＊本訊息為活動詢問內容並非實際訂單</p>
        </div>
    );
});

export default MessageVorderItem;
