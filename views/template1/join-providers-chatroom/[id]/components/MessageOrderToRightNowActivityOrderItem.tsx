"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import Image from "next/image";
import { areasTW } from "@/config/area-tw.config";

/**
 * 聊天室一般預訂單轉即刻快閃單訊息格式
 */
const MessageOrderOrVorderToCreateRightNowActivityOrderItem = memo(({ lng, message }: { lng: string; message: MessageInterface }) => {
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
                        {message.orderData?.startedAt}
                    </li>
                    <li>
                        <span className="text-gray-400">結束時間：</span>
                        {message.orderData?.endedAt}
                    </li>
                    {message.orderData && message.orderData.district !== undefined && message.orderData.location !== undefined ? (
                        <li>
                            <span className="text-gray-400">活動地點：</span>
                            {areasTW[message.orderData.district].name} | {message.orderData.location}
                        </li>
                    ) : null}
                    <li>
                        <span className="text-gray-400">活動內容：</span>
                        {message.orderData?.description}
                    </li>
                    <li className="font-bold">
                        <span>費用合計：</span>
                        <span className="text-red-500 OpenSansFont">${message.orderData?.price}</span>
                    </li>
                </ul>
                <button
                    onClick={createRightNowActivityOrderByOrder}
                    className="w-full px-2 py-1 my-2 text-white bg-red-500 rounded"
                >
                    發起即刻快閃
                </button>
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
                        {message.orderData?.startedAt}
                    </li>
                    <li>
                        <span className="text-gray-400">活動內容：</span>
                        {message.orderData?.description}
                    </li>
                </ul>
                <button
                    onClick={createRightNowActivityOrderByVorder}
                    className="w-full px-2 py-1 my-2 text-white bg-red-500 rounded"
                >
                    發起即刻快閃
                </button>
            </div>
        </div>
    );

    return (
        <div>
            {message.type === "createDemandByDating" && OrderToCreateRighNowActivityOrderTmp}
            {message.type === "createDemandByVorder" && VOrderToCreateRighNowActivityOrderTmp}
        </div>
    );
});

export default MessageOrderOrVorderToCreateRightNowActivityOrderItem;
