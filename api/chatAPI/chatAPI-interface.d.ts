import { VerificationSMSCodeAPIResInterface } from "../authAPI/authAPI-interface";
/**
 * 設定聊天對象 api 請求參數
 */
export interface SetReceiverChatRoomAPIReqInterface {
    // 登入者 id
    loginUserId: string;
    // 聊天對象 id
    receiveUserId: string;
    // 是否為服務商
    isProvider: boolean;
}

/**
 * 設定聊天室資料與客服聊天室 api 請求參數
 */
export interface CreateChatRoomAPIReqInterface {
    // 登入者資料
    userData: VerificationSMSCodeAPIResInterface["user"];
    // 判斷是否預設為機器人
    needResetChatToBot: boolean;
    // 判斷是否發送歡迎訊息
    needSendWelcomeMessage: boolean;
}
