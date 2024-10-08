"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import { areasTW } from "@/config/area-tw.config";
import { ChatReceiverInterface } from "@/interface/chats";
import Image from "next/image";
import dayjs from "dayjs";

export const MessageVorderItem = memo(({ lng, message, providerData }: { lng: string; message: MessageInterface; providerData: ChatReceiverInterface }) => {
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
            <div className={tmc(["mt-3 cursor-pointer rounded-lg px-3 py-1.5 text-sm shadow-xl  max-w-[75%]", message.userId === userID ? "mr-2 bg-blue-500 text-white" : "ml-2 bg-white"])}>
                <div className="flex">
                    <span className="flex-1">已發送預訂諮詢，內容如下：</span>
                </div>
                <p>開始時間：{message.startedAt}</p>
                {message.endedAt && <p>結束時間：{message.endedAt}</p>}
                {message && message.district !== undefined && message.location !== undefined ? (
                    <p>
                        會面地點：{areasTW[message.district].name} | {message.location}
                    </p>
                ) : null}
                <p>活動內容：{message.description}</p>
                <p className="mt-2 text-md font-bold">＊本訊息為活動詢問內容並非實際訂單</p>
            </div>
            {message.userId !== userID && <div className="ml-[13px] text-[12px] text-gray-third">{dayjs(message.createdAt).format("MM/DD HH:mm")}</div>}
        </li>
    );
});

export default MessageVorderItem;
