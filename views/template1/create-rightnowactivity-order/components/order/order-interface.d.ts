// 即刻快閃開單 需要資料
export interface RightNowActivityOrderFormInterface {
    // 每小時或天數出席費單價
    price: number;
    // 時常或天數
    duration: number;
    // 選擇開始時間 是否現在或指定時間
    timeType: string;
    // 活動計價單位 hour = 小時 day = 天數
    unit: "hour" | "day";
    // 開始日期
    startDate?: Date | null;
    // 開始時間
    startTime?: Date | null;
    // 結束日期
    endDate?: Date | null;
    // 結束時間
    endTime?: string | null;
    // 招募服務商截止日期
    dueDate?: Date | null;
    // 招募服務商截止 時間
    dueTime?: Date | null;
    // 需求人數
    requiredProviderCount: number;
    // 需求備註
    note?: string | null;
    // 同意條款
    accept: boolean;
}

/**
 * 即刻快閃開單畫面需要格式資料
 */
export interface RightNowActivityOrderCreateFormInterface {
    order: RightNowActivityOrderFormInterface;
}
