"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import ContactWe from "../components/ContactWe";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * 待赴約服務商聊天列表 ui
 * @param param0
 * @returns
 */
export default function RightNowActivityJoinProvidersChatRoomListView({ lng }: { lng: string }) {
    interface ChatRooms {
        id: string;
        cover: string;
        name: string;
    }
    interface ProviderSend {
        id: string;
    }

    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    const [orderId, setOrderId] = useState<string>("1");
    const [chatrooms, setChatRooms] = useState<ChatRooms[]>();

    // 導頁去與服務商1對1聊天
    const goToChatRoom = (id: string) => {
        router.push(`/join-providers-chatroom/${id}`);
        return;
    };

    // 導頁去訂單細節頁
    const goToOrderDetail = (id: string) => {
        router.push(`/rightnowactivity-order/${id}`);
        return;
    };

    useEffect(() => {
        setChatRooms(
            Array.from({ length: 10 }).map((_, i) => ({
                id: `chatroom-${i}`,
                cover: `https://picsum.photos/id/${i + 10}/300/300`,
                name: `provider-name-${i + 1}`,
            }))
        );
    }, []);

    return (
        <div className="mx-auto max-w-[400px] mt-[40px]">
            <h1 className="text-md-title font-bold text-center">{t("rightNowActivityJoinProvidersChatRoom.title")}</h1>
            <div className="border border-gray-light rounded-md mt-[40px]">
                <h3 className="text-lg-content font-semibold text-center py-[16px] border-b border-b-gray-light">{t("rightNowActivityJoinProvidersChatRoom.watingProviders")}</h3>
                <ul
                    id="scrollableDiv"
                    style={{
                        height: 300,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column-reverse",
                    }}
                >
                    {Array.isArray(chatrooms) &&
                        chatrooms.map((chatroom) => (
                            <li
                                key={chatroom.id}
                                className="flex items-center py-[10px] px-[15px]"
                            >
                                <Image
                                    src={chatroom.cover}
                                    alt="provider-cover"
                                    width={100}
                                    height={100}
                                    style={{ width: "80px", height: "auto" }}
                                    className="rounded-full w-[50px] h-[50px] mr-[20px]"
                                />
                                <h4 className="text-gray-primary flex-1 text-lg-content font-semibold">{chatroom.name}</h4>
                                <button
                                    onClick={() => goToChatRoom(chatroom.id)}
                                    className="PrimaryGradient h-[40px] min-w-[100px] text-white rounded-md"
                                >
                                    {t("global.sendMessage")}
                                </button>
                            </li>
                        ))}
                </ul>
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
