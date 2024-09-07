import { UserProfileInterface } from "./user";

// 訂單 type
type orderDataType = {
    order_id: string;
    // 訂單開始時間
    order_started: null | string;
    // 訂單結束時間
    order_ended: null | string;
    // 訂單狀態
    order_status: number;
};

export interface ChatRoomInterface {
    // 未讀訊息數量
    unReadMessageCount: number;
    // 最後發訊息時間
    lastMsgAt: number;
    // 判斷是否為服務商
    isProvider: boolean;
    // 最後發送訊息
    message: string;
    // 已讀時間
    readedAt: number;
    // 判斷是否為機器人
    isBot?: boolean | void;
    // 更新資料時間
    updatedAt: number;
    // 已確認訂單
    confirmedOrder?: orderDataType;
    // 未確認訂單
    unconfirmedOrder?: orderDataType;
    // 使用者資料
    userData: UserProfileInterface;
}

/**
 * 發送訊息 api
 */
export interface SencChatMessageAPIInterface {
    // 登入者 id
    loginUserId: string;
    // 聊天對象 id
    receiveUserId: string;
    // 聊天對象名稱
    receiveUserName?: string;
    // 聊天室訊息
    message?: string;
    // 登入者資料
    loginUserData?: UserProfileInterface;
    // 判斷是否為服務商
    isProvider: boolean;
    // 圖片連結
    imageUrl?: string | void;
    // gps 經緯度資料
    lat?: string;
    // gps 經緯度資料
    long?: string;
}

/**
 * 聊天對象資料
 */
export interface ChatReceiverInterface {
    id: string;
    name: string;
    avatar: string;
    // 最後發訊息時間
    lastMsgAt?: number;
    // 更新資料時間
    updatedAt?: number;
    // 已確認訂單
    confirmedOrder?: orderDataType;
    // 未確認訂單
    unconfirmedOrder?: orderDataType;
}
