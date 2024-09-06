import { SencChatMessageAPIInterface } from "@/interface/chats";
import useMyFetch from "@/service/http-request";
import type { GetProp, UploadFile, UploadProps } from "antd";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

/**
 * 發送聊天訊息
 */
export async function SendChatMessageAPI(data: SencChatMessageAPIInterface) {
    return useMyFetch(`${apiNestJSURL}/chats/send-chat-message`, { method: "post", body: JSON.stringify(data) });
}

/**
 * 發送聊天室圖片訊息
 */
export async function SendChatImageMessageAPI(data: SencChatMessageAPIInterface) {
    return useMyFetch(`${apiNestJSURL}/chats/send-chat-image`, { method: "post", body: JSON.stringify(data) });
}

/**
 * 發送GPS定位訊息
 */
export async function SendChatGPSMessageAPI(data: SencChatMessageAPIInterface) {
    return useMyFetch(`${apiNestJSURL}/chats/send-gps-location`, { method: "post", body: JSON.stringify(data) });
}

/**
 * 上傳聊天室檔案api
 * @param { type File(檔案格式) } file 圖片或其他附件檔案（暫時只限定傳圖片）
 */
export async function ChatUploadAttachmentsAPI(file: any): Promise<{ url: string }> {
    let result = new FormData();
    result.append("file", file as FileType);
    return useMyFetch(`${apiURL}/chat/attachments`, { method: "post", body: result, headers: { isFormData: true } });
}
export const ChatUploadAttachmentsAPIURL = `${apiURL}/chat/attachments`;
