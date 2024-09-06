"use client";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import ContactWe from "../components/ContactWe";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { firebaseDbCollection } from "@/lib/firebase/firebase-hooks";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import type { ChatRoomInterface } from "@/interface/chats";
import { setChatReceiver } from "@/store-toolkit/stores/chatStore";
// 無限滾動套件
import InfiniteScroll from "react-infinite-scroll-component";

// 使用 loadash 指定 key 排序方法
import * as _ from "lodash";

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
    const dispatch = useAppDispatch();

    const [orderId, setOrderId] = useState<string>("1");
    const [chatrooms, setChatRooms] = useState<ChatRoomInterface[]>();
    const [chatRoomsPaginationKey, setChatRoomsPaginationKey] = useState<any>(0);
    const paginationLimit = 15;

    // 導頁去與服務商1對1聊天
    const goToChatRoom = ({ id, name }: { id: string; name: string }) => {
        // 設定聊天對象資料
        dispatch(
            setChatReceiver({
                id,
                name,
            })
        );
        router.push(`/join-providers-chatroom/${id}`);
        return;
    };

    // 導頁去訂單細節頁
    const goToOrderDetail = (id: string) => {
        router.push(`/rightnowactivity-order/${id}`);
        return;
    };

    const userStore = useAppSelector((state) => {
        return state.userStore;
    });

    const id = userBananaIdSelector(userStore);
    const serviceChatId = process.env.NEXT_PUBLIC_SERVICE_CHAT_ID;

    const listenChatUsers = async () => {
        const chatUsersRef = firebaseDbCollection(`chat_rooms/${id}/users`);
        chatUsersRef.onSnapshot((docs: any) => {
            docs.docChanges().forEach((change: any) => {
                // 當有新增資料時會觸發
                if (change.type === "added") {
                    updataChatRooms(change.doc.data());
                }
                // 當有更新資料時會觸發
                if (change.type === "modified") {
                    updataChatRooms(change.doc.data());
                }
                // 當有刪除資料時會觸發
                if (change.type === "removed") {
                    // console.log("Removed user: ", change.doc.data());
                }
            });
        });
    };

    const updataChatRooms = (chatRoomData: ChatRoomInterface) => {
        const index = chatrooms?.findIndex((chatroom) => chatroom.userData.banana_id === chatRoomData.userData.banana_id);
        if (index === -1 && Array.isArray(chatrooms)) {
            let arr: any = chatrooms;
            arr[index] = chatRoomData;
            arr = _.orderBy("lastMsgAt", "asc");
            setChatRooms(arr);
        } else if (Array.isArray(chatrooms)) {
            let arr: any = chatrooms;
            arr = _.orderBy("lastMsgAt", "asc");
            setChatRooms([...arr, chatRoomData]);
        }
    };

    const fetchMoreData = async () => {
        console.log("fetching more data");
        const chatUsersRef = firebaseDbCollection(`chat_rooms/${id}/users`);
        // 判斷最後一頁時不往下執行
        if (chatRoomsPaginationKey === "end") {
            return;
        }
        try {
            // 聊天對象名單 collection
            let queryUsers: any = await chatUsersRef.orderBy("lastMsgAt", "asc").limit(paginationLimit).startAfter(chatRoomsPaginationKey).get();
            if (queryUsers.empty || !Array.isArray(chatrooms)) {
                setChatRoomsPaginationKey("end");
                return;
            }
            let result: any = [...chatrooms];
            queryUsers.forEach((item: any) => {
                if (item.id !== serviceChatId) {
                    result = [...result, item.data()];
                }
            });
            result = _.orderBy(result, ["lastMsgAt"], ["asc"]);
            setChatRooms(result);
            setChatRoomsPaginationKey(queryUsers.docs[queryUsers.docs.length - 1]);
            return result;
        } catch (err) {
            console.log("getUsers err =>", err);
        }
    };

    const getUsers = async () => {
        const chatUsersRef = firebaseDbCollection(`chat_rooms/${id}/users`);
        try {
            // 聊天對象名單 collection
            let queryUsers: any = await chatUsersRef.orderBy("lastMsgAt", "asc").limit(paginationLimit).get();
            console.log("work-0");
            if (queryUsers.empty) {
                console.log("work");
                setChatRoomsPaginationKey("end");
                return;
            }
            let result: any = [];
            queryUsers.forEach((item: any) => {
                if (item.id !== serviceChatId) {
                    result = [...result, item.data()];
                }
            });
            result = _.orderBy(result, ["lastMsgAt"], ["asc"]);
            setChatRooms(result);
            setChatRoomsPaginationKey(queryUsers.docs[queryUsers.docs.length - 1]);
            return result;
        } catch (err) {
            console.log("getUsers err =>", err);
        }
    };

    const fetchData = useCallback(async () => {
        const promises = [getUsers()];
        try {
            const result = await Promise.all(promises);
            console.log("promises =>", result);
        } catch (err) {
            console.log("fetchData err =>", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                    {Array.isArray(chatrooms) && (
                        <InfiniteScroll
                            dataLength={chatrooms.length}
                            next={fetchMoreData}
                            style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
                            inverse={true} //
                            hasMore={true}
                            loader={<h4>Loading...</h4>}
                            scrollableTarget="scrollableDiv"
                        >
                            {chatrooms.map((chatroom, index) => {
                                if (chatroom.userData) {
                                    return (
                                        <li
                                            key={chatroom.userData.banana_id}
                                            className="flex items-center py-[10px] px-[15px]"
                                        >
                                            {typeof chatroom.userData.cover === "string" && (
                                                <Image
                                                    src={chatroom.userData.cover}
                                                    alt="provider-cover"
                                                    width={100}
                                                    height={100}
                                                    style={{ width: "80px", height: "auto" }}
                                                    className="rounded-full w-[50px] h-[50px] mr-[20px]"
                                                />
                                            )}
                                            <h4 className="text-gray-primary flex-1 text-lg-content font-semibold">{chatroom.userData.name}</h4>
                                            {typeof chatroom.userData.banana_id === "string" && (
                                                <button
                                                    onClick={() => goToChatRoom({ id: chatroom.userData.banana_id!, name: chatroom.userData.name! })}
                                                    className="PrimaryGradient h-[40px] min-w-[100px] text-white rounded-md"
                                                >
                                                    {t("global.sendMessage")}
                                                </button>
                                            )}
                                        </li>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </InfiniteScroll>
                    )}
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
