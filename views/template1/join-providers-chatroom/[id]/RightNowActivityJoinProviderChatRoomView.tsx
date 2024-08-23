"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Input } from "antd";
import Image from "next/image";
import ContactWe from "../../components/ContactWe";
import styles from "../styles/RightNowActivityJoinProviderChatRoomListView.module.scss";
import { tmc } from "@/service/utils";
// 無限滾動套件
import InfiniteScroll from "react-infinite-scroll-component";
import dayjs from "dayjs";

/**
 * 與報名服務商1對1聊天室 ui
 * @param param0
 * @returns
 */
export default function RightNowActivityJoinProviderChatRoomView({ lng }: { lng: string }) {
    interface ProviderDataInterface {
        id: string;
        name: string;
        cover: string;
    }
    interface Message {
        id: string;
        userId: string;
        createdAt: string;
    }

    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    const [orderId, setOrderId] = useState<string>("1");
    const [providerData, setProviderData] = useState<ProviderDataInterface>({
        name: "",
        cover: "",
        id: "",
    });
    const [messages, setMessages] = useState<Message[]>();

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
                const arr: Message[] = [
                    ...messages,
                    ...Array.from({ length: 10 }).map((_, i) => ({
                        id: `message-${i + messages.length}`,
                        userId: `userId-${messages.length}`,
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
                            {messages.map((message) => (
                                <li
                                    key={message.id}
                                    className="mb-2 flex items-center"
                                >
                                    {typeof providerData.cover === "string" && (
                                        <Image
                                            src={providerData.cover}
                                            alt="provider cover"
                                            width={100}
                                            height={100}
                                            style={{ width: "50px", height: "auto" }}
                                            className="rounded-full mr-[13px]"
                                        />
                                    )}
                                    <div className="flex items-end">
                                        <span className="bg-gray-light rounded-full py-[9px] px-[15px] text-gray-primary text-[15px] mr-[13px]">{message.id}</span>
                                        <span>{dayjs(message.createdAt).format("H:mm")}</span>
                                    </div>
                                </li>
                            ))}
                        </InfiniteScroll>
                    )}
                </ul>
                <div className={tmc([styles["chatroom"], "flex items-center relative my-2"])}>
                    <Input
                        className="h-[46px]"
                        placeholder={t("rightNowActivityJoinProvidersChatRoom.input-placeholder")}
                    />
                    <Image
                        src="/img/icons/photo.svg"
                        width={100}
                        height={100}
                        alt="chatroom photo"
                        style={{ width: "30px", height: "auto" }}
                        className="absolute h-full right-[60px]"
                    />
                    <Image
                        src="/img/icons/location.svg"
                        width={100}
                        height={100}
                        alt="chatroom photo"
                        style={{ width: "30px", height: "auto" }}
                        className="absolute h-full right-[20px]"
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
