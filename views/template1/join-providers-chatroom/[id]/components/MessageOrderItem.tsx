"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { tmc } from "@/service/utils";
import { MessageInterface } from "../RightNowActivityJoinProviderChatRoom-interface";
import { areasTW } from "@/config/area-tw.config";

/**
 * 聊天室訂單訊息格式 ui
 */
const MessageOrderItem = memo(({ lng, message }: { lng: string; message: MessageInterface }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    // 登入者 id
    const userID = userBananaIdSelector(userStore);

    // 續約單type
    const extendOrderTypes = ["updateExtendOrder", "createExtendOrder"];
    // 取消續約單或核准type
    const cancelOrAcceptExtendOrderTypes = ["cancelExtendOrderByUser", "cancelExtendOrderByProvider", "acceptExtendOrderByProvider"];
    // 取消續約單或核准type
    const cancelOrAcceptOrderTypes = ["cancelOrderByUser", "cancelOrderByUserAndFeePay", "cancelOrderByProvider", "acceptOrderByProvider"];
    // 發起預訂 跟 修改預訂
    const orderCreateOrUpdateOrDemandTypes = ["createDating", "updateDating", "acceptDatingDemandEnrollment"];
    // 系統type
    const systemOrderTypes = ["startDating", "completeDating", "cancelOrderBySystem"];

    /**
     * 新增或修改預訂單樣板
     */
    const CreateOrUpdateTmp = (
        <div className={tmc(["rounded-lg px-3 py-1.5 text-sm shadow-xl", message.userId === userID ? "mr-2 bg-blue-500 text-white" : "ml-2 bg-white"])}>
            <div className="flex">{message.type !== "acceptDatingDemandEnrollment" ? <span className="flex-1">已{message.type === "updateDating" ? "修改" : "發起"}預訂，內容如下：</span> : <span className="flex-1">已接受即刻快閃報名，請準時出席：</span>}</div>
            <p>開始時間：{message.orderData?.startedAt}</p>
            <p>結束時間：{message.orderData?.endedAt}</p>
            {message.orderData && message.orderData.district !== undefined && message.orderData.location !== undefined ? (
                <p>
                    會面地點：{areasTW[message.orderData.district].name} |{message.orderData.location}
                </p>
            ) : null}
            ;
            <div>
                <p>出席費用：$ {message.orderData?.price}</p>
                {message.orderData?.paidBy === 1 && <span>(現金付款)</span>}
            </div>
        </div>
    );

    /**
     * 新增續約單或更新樣板
     */
    const CreateOrUpdateExtendOrderTmp = (
        <div className={tmc(["rounded-lg px-3 py-1.5 text-sm shadow-xl", message.userId === userID ? "mr-2 bg-blue-500 text-white" : "ml-2 bg-white"])}>
            <div className="flex">
                <span className="flex-1">{message.type === "updateExtendOrder" ? "修改" : "提出"}續約，內容如下：</span>
            </div>
            <p>續約時間：{message.orderData?.duration} 小時</p>
            <p>結束時間：{message.orderData?.endedAt}</p>
            <p>出席費用：$ {message.orderData?.price}</p>
        </div>
    );

    /**
     * 取消訂單
     */
    const CancelOrderTmp = (
        <div className={tmc(["rounded-lg px-3 py-1.5 text-sm shadow-xl", message.userId === userID ? "mr-2 bg-blue-500 text-white" : "ml-2 bg-white"])}>
            <div className="flex">
                <span className="flex-1">{message.type!}</span>
            </div>
            {message.type !== "acceptOrderByProvider" && (
                <p className="break-all">
                    {message.type === "cancelOrderByProvider" ? "婉拒" : "取消"} 原因：{message.orderData?.note}
                </p>
            )}
        </div>
    );

    /**
     * 續約單或成立取消
     */
    const ExtendOrderCancelOrAcceptTmp = (
        <div className={tmc(["mt-3 rounded-lg px-3 py-1.5 text-sm shadow-xl", message.userId === userID ? "mr-2 bg-blue-500 text-white" : "ml-2 bg-white"])}>
            <div className="flex">
                <span className="flex-1">{message.type!}</span>
            </div>
        </div>
    );

    /**
     * 系統婉拒預訂
     */
    const SystemOrderTmp = (
        <div className={tmc(["mt-3 whitespace-pre rounded-lg px-3 py-1.5 text-sm shadow-xl", message.userId === userID ? "mr-2 bg-blue-500 text-white" : "ml-2 bg-white"])}>
            <div className="flex items-start">
                <span className="flex-1">{message.type!}</span>
            </div>
        </div>
    );

    return (
        <div>
            {orderCreateOrUpdateOrDemandTypes.includes(message.type!) && CreateOrUpdateTmp}
            {extendOrderTypes.includes(message.type!) && CreateOrUpdateExtendOrderTmp}
            {cancelOrAcceptExtendOrderTypes.includes(message.type!) && ExtendOrderCancelOrAcceptTmp}
            {cancelOrAcceptOrderTypes.includes(message.type!) && CancelOrderTmp}
            {systemOrderTypes.includes(message.type!) && SystemOrderTmp}
        </div>
    );
});

export default MessageOrderItem;
