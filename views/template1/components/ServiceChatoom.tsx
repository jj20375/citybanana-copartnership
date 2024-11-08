"use client";
import { useTranslation } from "@/i18n/i18n-client";
import { firebaseUpdateUserUnReadMessageCountByServiceChat } from "@/lib/firebase/firebase-chat-hooks";
import { firebaseDbDoc } from "@/lib/firebase/firebase-hooks";
import { setChatReceiver } from "@/store-toolkit/stores/chatStore";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChatReceiverInterface } from "@/interface/chats";

export default function ServiceChatRoom({ lng, serviceChatID }: { lng: string; serviceChatID: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();
    const dispatch = useAppDispatch();

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

        router.push(`/join-providers-chatroom/${id}`);
        return;
    };

    const userID = useAppSelector((state) => state.userStore.user.banana_id);
    const [serviceChatUserData, setServiceChatUserData] = useState<any>(null);
    // 判斷是否 firebase 登入成功
    const isFirebaseAuth = useAppSelector((state) => state.userStore.isFirebaseAuth);

    /**
     * 監聽客服聊天對象
     */
    const listenServiceChat = async () => {
        const serviceChatRoom = firebaseDbDoc(`chat_rooms/${userID}/users/${serviceChatID}`);
        serviceChatRoom.onSnapshot(async (snapshot: any) => {
            setServiceChatUserData(snapshot.data());
            // 判斷未讀訊息是大於 0 時觸發
            if (snapshot.data().unReadMessageCount > 0) {
                // 更新登入者與客服聊天未讀訊息數量總計
                await firebaseUpdateUserUnReadMessageCountByServiceChat(userID);
            }
        });
    };

    const fetchData = useCallback(async () => {
        try {
            await listenServiceChat();
        } catch (err) {
            console.log("監聽客服聊天室失敗", err);
        }
    }, []);

    useEffect(() => {
        if (userID !== "" && isFirebaseAuth) {
            fetchData();
        }
    }, [userID, isFirebaseAuth]);
    return (
        <div>
            {serviceChatUserData ? (
                <>
                    <h2 className="pl-[15px] mb-[5px] font-medium">{t("global.serviceChat")}</h2>
                    <div
                        onClick={() => goToChatRoom({ id: serviceChatID, name: serviceChatUserData.userData.name, avatar: "/img/logos/logo_type1.svg" })}
                        className="flex items-center px-[15px] cursor-pointer"
                    >
                        <Image
                            src="/img/logos/logo_type1.svg"
                            alt="provider-cover"
                            width={50}
                            height={50}
                            style={{ width: "50px", height: "auto" }}
                            className="rounded-full w-[50px] h-[50px] mr-[20px]"
                        />
                        <h4 className="text-gray-primary flex-1 text-lg-content font-semibold">{serviceChatUserData.userData.name}</h4>
                    </div>
                </>
            ) : null}
        </div>
    );
}
