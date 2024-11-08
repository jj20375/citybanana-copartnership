"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { SendChatGPSMessageAPI } from "@/api/chatAPI/chatAPI";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { message, Modal, Spin } from "antd";
import { useTranslation } from "@/i18n/i18n-client";

const SendGPSMessage = memo(({ lng, srcollDownMessagesEnd }: { lng: string; srcollDownMessagesEnd: Function }) => {
    const { t } = useTranslation(lng, "main");
    const userStore = useAppSelector((state) => state.userStore);
    const chatStore = useAppSelector((state) => state.chatStore);
    // 登入者 id
    const loginUserId = userBananaIdSelector(userStore);
    // 聊天對象資料
    const chatReceiver = chatStore.chatReceiver;

    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    // 取得定位成功
    const successGPS = async (position: GeolocationPosition) => {
        let lat: string | number = position.coords.latitude;
        let long: string | number = position.coords.longitude;
        lat = lat.toString();
        long = long.toString();
        console.log(lat, long);
        // 接著寫確認了座標後要執行的事
        try {
            await SendChatGPSMessageAPI({
                loginUserId: loginUserId,
                receiveUserId: chatReceiver.id,
                receiveUserName: chatReceiver.name,
                lat,
                long,
                isProvider: false,
            });
            setLoading(false);
            setShowDialog(false);
            srcollDownMessagesEnd();
        } catch (err) {
            console.log("SendChatGPSMessageAPI err => ", err);
            setLoading(false);
        }
    };
    // 取得定位失敗
    const errorGPS = () => {
        message.error("您的裝置不支援定位功能");
        setLoading(false);
        // 接著寫使用者「封鎖」位置資訊請求後要執行的事
    };

    // 取得使用者目前位置
    const getGPS = () => {
        if (!navigator.geolocation) {
            message.error("您的裝置不支援定位功能");
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(successGPS, errorGPS);
    };

    // 發送 GPS 訊息到後端
    const sendGPSMessage = () => {
        if (!navigator.geolocation) {
            message.error("您的裝置不支援定位功能");
            return;
        }
        setShowDialog(true);
    };

    // 確認後發送 GPS 訊息
    const onConfirmGPS = () => {
        getGPS();
    };

    return (
        <>
            <button
                className="absolute h-full right-[50px]"
                onClick={sendGPSMessage}
            >
                <Image
                    src="/img/icons/location.svg"
                    width={100}
                    height={100}
                    alt="chatroom photo"
                    style={{ width: "30px", height: "auto" }}
                />
            </button>
            <Modal
                title={<div></div>}
                centered
                open={showDialog}
                onOk={() => setShowDialog(false)}
                onCancel={() => setShowDialog(false)}
                footer={[]}
            >
                <p className="text-center font-bold mb-2">{t("rightNowActivityJoinProvidersChatRoom.confirmGPS")}</p>
                <div className="text-center w-full">
                    <Spin spinning={loading}>
                        <button
                            className="bg-primary text-white w-[150px] rounded h-[45px]"
                            onClick={onConfirmGPS}
                        >
                            {t("global.confirm")}
                        </button>
                    </Spin>
                </div>
            </Modal>
        </>
    );
});

export default SendGPSMessage;
