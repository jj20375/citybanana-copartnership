// 聊天室訊息格式
export interface MessageInterface {
    id: string;
    userId: string;
    content: string;
    type?: string | void;
    createdAt: string;
}

// 聊天室服務商資料
export interface ProviderDataByChatRoomInterface {
    id: string;
    name: string;
    cover: string;
}
