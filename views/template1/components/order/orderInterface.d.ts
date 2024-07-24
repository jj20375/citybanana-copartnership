// 即刻快閃開單 需要資料
export interface RightNowActivityOrderFormInterface {
    order: {
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
        startTime?: string | null;
        // 結束日期
        endDate?: Date | null;
        // 結束時間
        endTime?: string | null;
        // 需求人數
        requiredNumber: number;
        // 需求備註
        note?: string | null;
    };
}
