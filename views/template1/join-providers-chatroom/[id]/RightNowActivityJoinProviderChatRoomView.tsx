"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import ContactWe from "../../components/ContactWe";
import styles from "../styles/RightNowActivityJoinProviderChatRoomListView.module.scss";
import { tmc } from "@/service/utils";
// 無限滾動套件
import InfiniteScroll from "react-infinite-scroll-component";
// 聊天室內容 ui
import MessageItem from "./components/MessageItem";
// 訂單聊天室內容 ui
import MessageOrderItem from "./components/MessageOrderItem";
// 一般預訂單或詢問單轉即刻快閃單內容 ui
import MessageOrderOrVorderToCreateRightNowActivityOrderItem from "./components/MessageOrderToRightNowActivityOrderItem";
// 詢問單聊天室內容 ui
import MessageVorderItem from "./components/MessageVorderItem";
// gps 聊天室內容 ui
import MessageGpsItem from "./components/ＭessageGpsItem";
// 有圖片的聊天室內容 ui
import MessageImageItem from "./components/MessageImageItem";
// 警告文字 聊天室內容 ui
import MessageWarningItem from "./components/MessageWarningItem";
// 發送聊天室訊息 ui
import SendMessage from "./components/SendMessage";
// 聊天室上傳圖片 ui
import ChatRoomUpload from "./components/ChatRoomUploadPhoto";
// 發送 gps 聊天訊息 ui
import SendGPSMessage from "./components/SendGPSMessage";
import dayjs from "dayjs";
import { useAppSelector, useAppDispatch } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { firebaseConnectRef, firebaseDbDoc } from "@/lib/firebase/firebase-hooks";
import { setChatReceiver } from "@/store-toolkit/stores/chatStore";
import { UserProfileInterface } from "@/interface/user";
import type { MessageInterface } from "./RightNowActivityJoinProviderChatRoom-interface";
import type { ChatReceiverInterface } from "@/interface/chats";
import { firebaseCheckUserChatRoomEmpty, firebaseGetChatRoomUnReadMessageCountTotal, firebaseMessageReaded, firebaseUpdateUserUnReadMessageCount } from "@/lib/firebase/firebase-chat-hooks";

/**
 * 與報名服務商1對1聊天室 ui
 * @param param0
 * @returns
 */
export default function RightNowActivityJoinProviderChatRoomView({ lng, receiverId }: { lng: string; receiverId: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    const dispatch = useAppDispatch();
    const userStore = useAppSelector((state) => state.userStore);
    const chatStore = useAppSelector((state) => state.chatStore);

    const id = userBananaIdSelector(userStore);
    // 聊天對象資料
    const chatReceiver = chatStore.chatReceiver;

    // 發送訊息  dom
    const sendMessageRef = useRef<any>(null);
    // 發送訊息事件
    const onSendMessage = () => {
        sendMessageRef.current?.onSendMessage();
    };

    // 訂單 id
    const [orderId, setOrderId] = useState<string>("1");
    // 聊天室訊息
    const [messages, setMessages] = useState<MessageInterface[]>();
    // 聊天室訊息分頁key
    const [messagePaginationKey, setMessagePaginationKey] = useState("");
    // 單筆分頁最多載入比數
    const messageLimit = 35;
    // 聊天訊息數量顯示上線
    const messageLengthLimit = Number(process.env.NEXT_PUBLIC_CHATS_MESSAGE_LIMIT);
    // 聊天室訂單type
    const orderTypes = [
        "extendDating",
        "createDating",
        "updateDating",
        "updateExtendOrder",
        "createExtendOrder",
        "cancelExtendOrderByUser",
        "cancelExtendOrderByProvider",
        "acceptExtendOrderByProvider",
        "cancelOrderByUser",
        "cancelOrderByUserAndFeePay",
        "cancelOrderByProvider",
        "cancelOrderBySystem",
        "acceptOrderByProvider",
        "completeDating",
        "startDating",
        "acceptDatingDemandEnrollment",
    ];
    // 透過一般預訂單 或 詢問單 轉成即刻快閃單 type
    const orderOrVorderTypeToCreateRightNowActivityOrderTypes = ["createDemandByDating", "createDemandByVorder"];
    // 詢問單 type
    const vorderTypes = ["vorder"];
    // gps type
    const gpsType = ["gps"];
    // image type
    const imageTypes = ["image"];
    // 警告文字 type
    const warningTypes = ["keywordWarning"];

    // 導頁去報名服務商聊天室列表
    const goToList = () => {
        router.push("/join-providers-chatroom");
    };

    // 導頁去訂單細節頁
    const goToOrderDetail = (id: string) => {
        router.push(`/rightnowactivity-order/${id}`);
        return;
    };

    // 滾動事件觸發載入歷史訊息
    const fetchMoreData = async () => {
        try {
            let snapshot = await firebaseConnectRef(`chats/${id}/${receiverId}`).orderByKey().endBefore(messagePaginationKey).limitToLast(messageLimit).once("value");

            //判斷有值時才執行
            if (snapshot.val() === null) {
                return;
            }
            // 判斷網上滾動時 最高可能讀取過去的訊息數量限制 超過數量 則不往下執行
            if (Array.isArray(messages) && messages.length >= messageLengthLimit) {
                return;
            }

            // 判斷最後一筆資料 key 與 最新資料的陣列中第一筆 key 相同 則不往下執行 代表沒有最新消息了
            if (Object.keys(snapshot.val())[0] === messagePaginationKey) {
                return;
            }

            // 聊天室沒有資料則不往下執行
            if (!Array.isArray(messages)) {
                return;
            }

            // 將物件資料整理成陣列格式
            let datas = Object.keys(snapshot.val())
                .map((objKey) => {
                    let obj = snapshot.val()[objKey];
                    obj.id = objKey;
                    return obj;
                })
                .reverse();

            const arr: MessageInterface[] = [...messages, ...datas];
            setMessages(arr);
            setMessagePaginationKey(datas[datas.length - 1].id);
        } catch (err) {
            console.error("fetchMoreData error =>", err);
        }
    };

    const getMessages = () => {
        console.log("messages id receiverId =>", id, receiverId, `chats/${id}/${receiverId}`);
        firebaseConnectRef(`chats/${id}/${receiverId}`)
            .orderByKey()
            .limitToLast(messageLimit)
            .on("value", async (snapshot: any) => {
                console.log("snapshot.val() =>", snapshot.val());
                // 判斷是否有資料
                if (snapshot.val() !== null) {
                    // 將物件資料整理成陣列格式
                    const messages = Object.keys(snapshot.val())
                        .map((objKey) => {
                            const obj = snapshot.val()[objKey];
                            obj.id = objKey;
                            return obj;
                        })
                        .reverse();
                    console.log("messages[0].key =>", messages[0].id);
                    setMessagePaginationKey(messages[messages.length - 1].id);
                    setMessages(messages);
                }
            });
    };

    const getReceiverData = useCallback(async () => {
        try {
            const doc = await firebaseDbDoc(`chat_rooms/${id}/users/${receiverId}`).get();
            if (doc.exists) {
                const userData: UserProfileInterface = doc.data().userData;
                console.log("get receiver data =>", userData);
                dispatch(
                    setChatReceiver({
                        id: userData.banana_id!,
                        name: userData.name!,
                        avatar: userData.thumbnails ? userData.thumbnails?.avatar["360x360"] : "",
                    })
                );
            }
        } catch (err) {
            console.log("getReceiverData err =>", err);
        }
    }, []);

    // 監聽聊天對象資料
    const listenerReceiver = () => {
        firebaseDbDoc(`chat_rooms/${id}/users/${receiverId}`).onSnapshot(
            async (snapshot: any) => {
                // 未取得聊天對象資料時 將聊天對象資料設定為預設值 且不往下執行
                if (!snapshot.exists) {
                    return;
                }
                console.log("work listerUserInfo", snapshot.data().userData);
                const receiverData = snapshot.data().userData;
                const setReceiverData: ChatReceiverInterface = {
                    id: receiverData.banana_id!,
                    name: receiverData.name!,
                    avatar: receiverData.thumbnails ? receiverData.thumbnails?.avatar["360x360"] : "",
                };
                // 判斷有未確認訂單資料時 新增此資料到聊天對像
                if (snapshot.data().unconfirmedOrder) {
                    setReceiverData.unconfirmedOrder = snapshot.data().unconfirmedOrder;
                }
                // 判斷有已確認訂單資料時 新增此資料到聊天對像
                if (snapshot.data().confirmedOrder) {
                    setReceiverData.confirmedOrder = snapshot.data().confirmedOrder;
                }
                dispatch(setChatReceiver(setReceiverData));
                // 判斷當前聊天對象時有未讀訊息時 要清空未讀訊息
                if (snapshot.data().unReadMessageCount > 0) {
                    // 取得指定對象中所有聊天對象未讀訊息總計
                    let userUnReadMessageCount: number | boolean = await firebaseGetChatRoomUnReadMessageCountTotal(id);
                    /**
                     * 此部分先省略 如發生真的未建立聊天對象時 再補上
                     */
                    // // 判斷聊天對象是否有資料
                    // const receiverDataEmpty = await firebaseCheckUserChatRoomEmpty(this.currentReceiveUserId);
                    // // 聊天對象為空資料時建立
                    // if (receiverDataEmpty) {
                    //     // 取得服務商資料
                    //     const { providerData } = await this.getProviderData();
                    //     // 建立聊天對象資料
                    //     await firebaseSetUserㄙChatRoom(providerData, this.currentReceiveUserId);
                    // }
                    // 更新 chat_rooms 中指定對象 所有未讀訊息數量
                    if (typeof userUnReadMessageCount === "number") {
                        await firebaseUpdateUserUnReadMessageCount(id, userUnReadMessageCount - snapshot.data().unReadMessageCount < 0 ? 0 : userUnReadMessageCount - snapshot.data().unReadMessageCount);
                    }

                    // 更新 firebase 聊天對象未讀訊息為 0
                    await firebaseMessageReaded(id, receiverData.banana_id);
                }
            },
            (error: any) => {
                console.log(error);
            }
        );
    };

    useEffect(() => {
        getReceiverData();
        listenerReceiver();
        setTimeout(() => {
            getMessages();
        }, 1000);
    }, []);

    return (
        <div className="mx-auto max-w-[400px] mt-[40px]">
            <h1 className="text-md-title font-bold text-center">{t("rightNowActivityJoinProvidersChatRoom.title")}</h1>
            <div className="border border-gray-light rounded-md mt-[40px] px-2">
                <div className="flex py-[16px] border-b border-b-gray-light items-center">
                    <Icon
                        className="text-3xl cursor-pointer text-gray-third mr-[11px]"
                        icon="iconamoon:arrow-left-2-light"
                        onClick={goToList}
                    />
                    <h3 className="text-lg-content font-bold">{chatReceiver.name}</h3>
                </div>
                {Array.isArray(messages) && <p className="text-center mt-5 text-gray-third text-[15px]">{dayjs(messages[messages.length - 1].createdAt).format("MM/D")}</p>}
                <ul
                    id="scrollableDiv"
                    style={{
                        height: 300,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column-reverse",
                    }}
                    className="mt-[40px]"
                >
                    {Array.isArray(messages) && (
                        <InfiniteScroll
                            dataLength={messages.length}
                            next={fetchMoreData}
                            style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
                            inverse={true} //
                            hasMore={true}
                            loader={<h4>Loading...</h4>}
                            scrollableTarget="scrollableDiv"
                        >
                            {messages.map((message, index) => {
                                if (message.type === undefined) {
                                    return (
                                        <MessageItem
                                            key={message.id}
                                            index={index}
                                            lng={lng}
                                            message={message}
                                            providerData={chatReceiver}
                                        />
                                    );
                                }
                                if (orderTypes.includes(message.type)) {
                                    return (
                                        <MessageOrderItem
                                            key={message.id}
                                            lng={lng}
                                            message={message}
                                        />
                                    );
                                }
                                if (orderOrVorderTypeToCreateRightNowActivityOrderTypes.includes(message.type)) {
                                    return (
                                        <MessageOrderOrVorderToCreateRightNowActivityOrderItem
                                            key={message.id}
                                            lng={lng}
                                            message={message}
                                        />
                                    );
                                }
                                if (vorderTypes.includes(message.type)) {
                                    return (
                                        <MessageVorderItem
                                            key={message.id}
                                            lng={lng}
                                            message={message}
                                        />
                                    );
                                }
                                if (gpsType.includes(message.type)) {
                                    return (
                                        <MessageGpsItem
                                            key={message.id}
                                            lng={lng}
                                            message={message}
                                        />
                                    );
                                }
                                if (imageTypes.includes(message.type)) {
                                    return (
                                        <MessageImageItem
                                            key={message.id}
                                            lng={lng}
                                            message={message}
                                        />
                                    );
                                }
                                if (warningTypes.includes(message.type)) {
                                    return (
                                        <MessageWarningItem
                                            key={message.id}
                                            lng={lng}
                                            message={message}
                                        />
                                    );
                                }
                            })}
                        </InfiniteScroll>
                    )}
                </ul>
                <div className={tmc([styles["chatroom"], "flex items-center relative my-2"])}>
                    <SendMessage
                        lng={lng}
                        ref={sendMessageRef}
                    />
                    <ChatRoomUpload lng={lng} />
                    <SendGPSMessage lng={lng} />
                    <button onClick={onSendMessage}>
                        <Image
                            src="/img/icons/send-message.svg"
                            width={100}
                            height={100}
                            alt="chatroom photo"
                            style={{ width: "30px", height: "auto" }}
                            className="h-full mx-[10px]"
                        />
                    </button>
                </div>
            </div>
            <div className="flex flex-col mt-[40px]">
                <button
                    onClick={() => goToOrderDetail(orderId)}
                    className="border border-primary rounded-md text-primary  h-[40px] text-lg-content"
                >
                    {t("rightNowActivityJoinProvidersChatRoom.button-seeOrder")}
                </button>
            </div>
            <ContactWe lng={lng} />
        </div>
    );
}
