import type { AreaInterface } from "@/interface/area";
// 聊天室訊息格式
export interface MessageInterface {
    id: string;
    userId: string;
    content: string;
    type?: string | void;
    createdAt: string;
    orderData?: {
        // 訂單結束時間
        endedAt?: string;
        // 訂單開始時間
        startedAt?: string;
        // 城市
        district?: AreaInterface;
        // 地點
        location?: string;
        // 出席費用
        price?: number;
        // 判斷是否現金付款
        paidBy?: 1;
        // 時數
        duration?: number;
        // 備註
        note?: string;
        // 活動內容
        description?: string;
    };
}
