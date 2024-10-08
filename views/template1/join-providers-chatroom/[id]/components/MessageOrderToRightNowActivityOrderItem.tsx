"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import Image from "next/image";
import { areasTW } from "@/config/area-tw.config";
import { ChatReceiverInterface } from "@/interface/chats";
import dayjs from "dayjs";

/**
 * 聊天室一般預訂單轉即刻快閃單訊息格式
 */
const MessageOrderOrVorderToCreateRightNowActivityOrderItem = memo(({ lng, message, providerData }: { lng: string; message: MessageInterface; providerData: ChatReceiverInterface }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    // 登入者 id
    const userID = userBananaIdSelector(userStore);

    /**
     * 透過一般預訂單轉即刻快閃單開立訂單方法
     * @returns
     */
    const createRightNowActivityOrderByOrder = () => {
        return true;
    };
    /**
     * 透過詢問單轉即刻快閃單開立訂單方法
     * @returns
     */
    const createRightNowActivityOrderByVorder = () => {
        return true;
    };

    // 透過一般預訂單轉即刻快閃單訊息格式
    const OrderToCreateRighNowActivityOrderTmp = (
        <div className={tmc(["mt-3 cursor-pointer rounded-lg text-sm shadow-xl max-w-[250px] min-w-[250px]", message.userId === userID ? "mr-2 bg-blue-500 text-white" : "ml-2 bg-white"])}>
            <Image
                src="/img/chats/rightNowActivity.jpg"
                className="w-full rounded-t-lg"
                alt=""
                width={100}
                height={100}
                style={{ width: "100%", height: "auto" }}
            />
            <div className="px-3 py-1.5">
                <ul>
                    <li>
                        <span className="text-gray-400">開始時間：</span>
                        {message.startedAt}
                    </li>
                    <li>
                        <span className="text-gray-400">結束時間：</span>
                        {message.endedAt}
                    </li>
                    {message && message.district !== undefined && message.location !== undefined ? (
                        <li className="flex">
                            <span className="text-gray-400 whitespace-nowrap">活動地點：</span>
                            {areasTW[message.district].name} | <span className="break-all">{message.location}</span>
                        </li>
                    ) : null}
                    <li className="flex">
                        <span className="whitespace-nowrap text-gray-400">活動內容：</span>
                        <span className="break-all">{message.description}</span>
                    </li>
                    <li className="font-bold">
                        <span>費用合計：</span>
                        <span className="text-red-500 OpenSansFont">{t("rightNowActivityOrder.price", { val: message.price })}</span>
                    </li>
                </ul>
                {/* <button
                    onClick={createRightNowActivityOrderByOrder}
                    className="w-full px-2 py-1 my-2 text-white bg-red-500 rounded"
                >
                    發起即刻快閃
                </button> */}
            </div>
        </div>
    );

    // 透過詢問單開立即刻快閃單訊息格式
    const VOrderToCreateRighNowActivityOrderTmp = (
        <div className={tmc(["cursor-pointer rounded-lg text-sm shadow-xl max-w-[250px] min-w-[250px]", message.userId === userID ? "mr-2 bg-blue-500 text-white" : "ml-2 bg-white"])}>
            <Image
                src="/img/chats/rightNowActivity.jpg"
                className="w-full rounded-t-lg"
                alt=""
                width={100}
                height={100}
                style={{ width: "100%", height: "auto" }}
            />

            <div className="px-3 py-1.5">
                <ul>
                    <li>
                        <span className="text-gray-400">開始時間：</span>
                        {message.startedAt}
                    </li>
                    <li>
                        <span className="text-gray-400">活動內容：</span>
                        {message.description}
                    </li>
                </ul>
                {/* <button
                    onClick={createRightNowActivityOrderByVorder}
                    className="w-full px-2 py-1 my-2 text-white bg-red-500 rounded"
                >
                    發起即刻快閃
                </button> */}
            </div>
        </div>
    );

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
            {message.type === "createDemandByDating" && OrderToCreateRighNowActivityOrderTmp}
            {message.type === "createDemandByVorder" && VOrderToCreateRighNowActivityOrderTmp}
            {message.userId !== userID && <div className="ml-[13px] text-[12px] text-gray-third">{dayjs(message.createdAt).format("MM/DD HH:mm")}</div>}
        </li>
    );
});

export default MessageOrderOrVorderToCreateRightNowActivityOrderItem;
