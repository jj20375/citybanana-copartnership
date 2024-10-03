// 即刻快閃列表卡片資料
export interface RightNowActivityOrderListItemInterface {
    id: string;
    // 活動名稱
    name: string;
    // 活動日期
    startDay: string;
    // 活動時間
    startDay: string;
    // 結束日期
    endDay: string;
    // 結束時間
    endTime: string;
    // 活動地點
    location: string;
    // 付款總金額
    total: number;
    // 招募服務商數量
    requiredProviderCount?: number;
}

// 一般預訂單列表卡片資料
export interface OrderLisItemtInterface extends RightNowActivityOrderListItemInterface {
    rightNowActivityID: string;
    providerData: {
        cover: string;
        name: string;
        id: string;
    };
}
