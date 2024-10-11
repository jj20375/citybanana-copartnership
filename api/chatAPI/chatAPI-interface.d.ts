/**
 * 設定聊天對象 api
 */
export interface SetReceiverChatRoomAPIReqInterface {
    // 登入者 id
    loginUserId: string;
    // 聊天對象 id
    receiveUserId: string;
    // 是否為服務商
    isProvider: boolean;
}
