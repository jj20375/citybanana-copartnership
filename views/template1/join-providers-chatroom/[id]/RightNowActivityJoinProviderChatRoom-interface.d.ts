// 聊天室訊息格式
export interface MessageInterface {
    id: string;
    userId: string;
    content: string;
    type?: string | void;
    createdAt: string;
}
