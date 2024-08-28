"use client";

import { useEffect, useState, useRef } from "react";
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
// 發送聊天室訊息 ui
import SendMessage from "./components/SendMessage";
// 聊天室上傳圖片 ui
import ChatRoomUpload from "./components/ChatRoomUploadPhoto";
import dayjs from "dayjs";
import { MessageInterface, ProviderDataByChatRoomInterface } from "./RightNowActivityJoinProviderChatRoom-interface";

/**
 * 與報名服務商1對1聊天室 ui
 * @param param0
 * @returns
 */
export default function RightNowActivityJoinProviderChatRoomView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    const sendMessageRef = useRef<any>(null);

    const onSendMessage = () => {
        sendMessageRef.current?.onSendMessage();
    };

    const [orderId, setOrderId] = useState<string>("1");
    const [providerData, setProviderData] = useState<ProviderDataByChatRoomInterface>({
        name: "",
        cover: "",
        id: "",
    });
    const [messages, setMessages] = useState<MessageInterface[]>();

    // 導頁去報名服務商聊天室列表
    const goToList = () => {
        router.push("/join-providers-chatroom");
    };

    // 導頁去訂單細節頁
    const goToOrderDetail = (id: string) => {
        router.push(`/rightnowactivity-order/${id}`);
        return;
    };

    const fetchMoreData = async () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        setTimeout(() => {
            if (Array.isArray(messages)) {
                const arr: MessageInterface[] = [
                    ...messages,
                    ...Array.from({ length: 10 }).map((_, i) => ({
                        id: `message-${i + messages.length}`,
                        userId: `userId-${messages.length}`,
                        content: `testmessage-${i}`,
                        createdAt: new Date().toDateString(),
                    })),
                ];
                setMessages(arr);
            }
        }, 1500);
    };

    useEffect(() => {
        setProviderData({
            id: "providerId-1",
            name: "測試服務商名稱",
            cover: "https://picsum.photos/id/11/300/300",
        });
        setMessages(
            Array.from({ length: 10 }).map((_, i) => ({
                id: `message-${i}`,
                userId: `userId-${i}`,
                content: `testmessage-${i}`,
                createdAt: new Date().toDateString(),
            }))
        );
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
                    <h3 className="text-lg-content font-bold">{providerData?.name}</h3>
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
                            {messages.map((message, index) => (
                                <MessageItem
                                    key={message.id}
                                    index={index}
                                    lng={lng}
                                    message={message}
                                    providerData={providerData}
                                />
                            ))}
                        </InfiniteScroll>
                    )}
                </ul>
                <div className={tmc([styles["chatroom"], "flex items-center relative my-2"])}>
                    <SendMessage
                        lng={lng}
                        ref={sendMessageRef}
                    />
                    <ChatRoomUpload lng={lng} />
                    <Image
                        src="/img/icons/location.svg"
                        width={100}
                        height={100}
                        alt="chatroom photo"
                        style={{ width: "30px", height: "auto" }}
                        className="absolute h-full right-[50px]"
                    />
                    <Image
                        src="/img/icons/send-message.svg"
                        width={100}
                        height={100}
                        alt="chatroom photo"
                        style={{ width: "30px", height: "auto" }}
                        className="h-full mx-[10px]"
                    />
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
