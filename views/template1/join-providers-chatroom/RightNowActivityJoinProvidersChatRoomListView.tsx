"use client";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import ContactWe from "../components/ContactWe";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { firebaseDbCollection } from "@/lib/firebase/firebase-hooks";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import type { ChatReceiverInterface, ChatRoomInterface } from "@/interface/chats";
import { setChatReceiver } from "@/store-toolkit/stores/chatStore";
// 無限滾動套件
import InfiniteScroll from "react-infinite-scroll-component";

// 使用 loadash 指定 key 排序方法
import * as _ from "lodash";
import { SetReceiverChatRoomAPIReqInterface } from "@/api/chatAPI/chatAPI-interface";
import { SetReceiverChatRoomAPI } from "@/api/chatAPI/chatAPI";
import ServiceChatRoom from "../components/ServiceChatoom";
import { tmc } from "@/service/utils";

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

    const userStore = useAppSelector((state) => {
        return state.userStore;
    });
    const userID = userBananaIdSelector(userStore);

    const [orderId, setOrderId] = useState<string>("1");
    const [chatrooms, setChatRooms] = useState<ChatRoomInterface[]>();
    const [chatRoomsPaginationKey, setChatRoomsPaginationKey] = useState<any>(0);
    const paginationLimit = 15;

    /**
     * 設定聊天對象資料
     * @param data
     */
    const setReceiverChatRoom = async (data: SetReceiverChatRoomAPIReqInterface) => {
        try {
            const res = await SetReceiverChatRoomAPI(data);
            console.log("SetReceiverChatRoomAPI =>", res);
        } catch (err) {
            console.log("SetReceiverChatRoomAPI err =>", err);
            throw err;
        }
    };

    // 導頁去與服務商1對1聊天
    const goToChatRoom = async ({ id, name, avatar }: ChatReceiverInterface) => {
        // 設定聊天對象資料
        dispatch(
            setChatReceiver({
                id,
                name,
                avatar,
            })
        );
        // 設定聊天對象資料
        await setReceiverChatRoom({
            loginUserId: userID,
            receiveUserId: id,
            isProvider: false,
        });
        router.push(`/join-providers-chatroom/${id}`);
        return;
    };

    // 導頁去訂單細節頁
    const goToOrderDetail = (id: string) => {
        router.push(`/rightnowactivity-order/${id}`);
        return;
    };

    // 判斷是否 firebase 登入成功
    const isFirebaseAuth = useAppSelector((state) => state.userStore.isFirebaseAuth);

    const serviceChatID = process.env.NEXT_PUBLIC_SERVICE_CHAT_ID;

    /**
     * 監聽其他聊天對象
     */
    const listenChatUsers = async () => {
        const chatUsersRef = firebaseDbCollection(`chat_rooms/${userID}/users`);
        chatUsersRef.where("confirmedOrder", "!=", null).onSnapshot((docs: any) => {
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

    /**
     * 更新聊天室資料
     * @param chatRoomData
     */
    const updataChatRooms = (chatRoomData: ChatRoomInterface) => {
        if (Array.isArray(chatrooms) && chatrooms.length > 0) {
            const index = chatrooms?.findIndex((chatroom) => {
                if (chatroom.userData !== undefined && chatRoomData.userData != undefined) {
                    // console.log("chatRoomData.userData =>", chatRoomData.userData);
                    return chatroom.userData.banana_id === chatRoomData.userData.banana_id;
                }
                return -1;
            });
            if (index === -1 && Array.isArray(chatrooms)) {
                let arr: any = chatrooms;
                arr[index] = chatRoomData;
                arr = _.orderBy("lastMsgAt", "asc");
                console.log("-1 arr =>", arr);
                setChatRooms(arr);
            } else if (Array.isArray(chatrooms)) {
                let arr: any = chatrooms;
                arr = _.orderBy("lastMsgAt", "asc");
                console.log("1 arr =>", arr);
                setChatRooms([...arr, chatRoomData]);
            }
        }
    };

    /**
     * 取得更多聊天對象
     * @returns
     */
    const fetchMoreData = async () => {
        const chatUsersRef = firebaseDbCollection(`chat_rooms/${userID}/users`);
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
                if (item.id !== serviceChatID) {
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
        const chatUsersRef = firebaseDbCollection(`chat_rooms/${userID}/users`);
        try {
            // 聊天對象名單 collection
            let queryUsers: any = await chatUsersRef.where("confirmedOrder", "!=", null).orderBy("lastMsgAt", "asc").limit(paginationLimit).get();
            console.log("queryUsers =>", queryUsers);
            if (queryUsers.empty) {
                setChatRoomsPaginationKey("end");
                return;
            }
            let result: any = [];
            queryUsers.forEach((item: any) => {
                if (item.id !== serviceChatID) {
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
        const promises = [getUsers(), listenChatUsers()];
        try {
            const result = await Promise.all(promises);
            console.log("promises =>", result);
        } catch (err) {
            console.log("fetchData err =>", err);
        }
    }, []);

    useEffect(() => {
        if (userID !== "" && isFirebaseAuth) {
            fetchData();
        }
    }, [userID, isFirebaseAuth]);

    return (
        <div className="mx-auto max-w-[400px] mt-[40px]">
            <h1 className="text-md-title font-bold text-center">{t("rightNowActivityJoinProvidersChatRoom.title")}</h1>
            <div className="mt-[40px] border-t border-gray-light pt-5">
                <ServiceChatRoom
                    lng={lng}
                    serviceChatID={serviceChatID!}
                />
                <h2 className="pl-[15px] mt-[15px] mb-[5px] font-medium">{t("global.provider")}</h2>
                <ul
                    id="scrollableDiv"
                    className={tmc(["flex flex-col-reverse overflow-auto", Array.isArray(chatrooms) && chatrooms.length > 15 ? "h-[300px]" : "h-auto"])}
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
                                            onClick={() => goToChatRoom({ id: chatroom.userData.banana_id!, name: chatroom.userData.name!, avatar: chatroom.userData.avatar! })}
                                            className="flex items-center py-[10px] px-[15px] cursor-pointer"
                                        >
                                            {typeof chatroom.userData.cover === "string" && (
                                                <Image
                                                    src={chatroom.userData.cover}
                                                    alt="provider-cover"
                                                    width={50}
                                                    height={50}
                                                    style={{ width: "50px", height: "auto" }}
                                                    className="rounded-full w-[50px] h-[50px] mr-[20px]"
                                                />
                                            )}

                                            <div>
                                                <h4 className="text-gray-primary flex-1 text-lg-content font-semibold">{chatroom.userData.name}</h4>
                                                <p className="line-clamp-1 text-gray-third text-sm-content">{chatroom.message}</p>
                                            </div>
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
        </div>
    );
}
