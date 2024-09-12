"use client";

import { memo, useState } from "react";
import { message, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { ChatUploadAttachmentsAPI, SendChatImageMessageAPI } from "@/api/chatAPI/chatAPI";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";

// 聊天室圖片上傳 ui
const ChatRoomUpload = memo(({ lng }: { lng: string }) => {
    const userStore = useAppSelector((state) => state.userStore);
    const chatStore = useAppSelector((state) => state.chatStore);
    // 聊天對象資料
    const chatReceiver = chatStore.chatReceiver;
    // 登入者 id
    const loginUserId = userBananaIdSelector(userStore);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async ({ file, onSuccess, onError }: any) => {
        setUploading(true);
        setFileList([...fileList, file]);
        // 傳送聊天室圖片檔案至後端資料夾
        try {
            const data = await ChatUploadAttachmentsAPI(file);
            message.success(`${file.name} file uploaded successfully`);
            const sendMessageData = {
                imageUrl: data.url,
                loginUserId: loginUserId,
                receiveUserId: chatReceiver.id,
                receiveUserName: chatReceiver.name,
                type: "image",
                isProvider: false,
                message: "傳送一張照片",
            };
            // 發送聊天室訊息
            try {
                await SendChatImageMessageAPI(sendMessageData);
                message.success(`${file.name} send message successfully`);
            } catch (err) {
                message.error(`${file.name} send message failed.`);
            }
        } catch (err) {
            message.error(`${file.name} file upload failed.`);
            console.log("Error uploading =>", err);
        } finally {
            setUploading(false);
        }
        return;
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        customRequest: handleUpload,
        fileList,
    };

    return (
        <Upload
            className="absolute h-full right-[90px] top-[10px]"
            {...props}
            maxCount={1}
        >
            <button>
                <Image
                    src="/img/icons/photo.svg"
                    width={100}
                    height={100}
                    alt="chatroom photo"
                    style={{ width: "30px", height: "auto" }}
                />
            </button>
        </Upload>
    );
});

export default ChatRoomUpload;
