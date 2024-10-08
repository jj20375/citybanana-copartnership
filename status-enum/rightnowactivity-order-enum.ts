// 會員即刻快閃狀態 status 定義
export enum rightNowActivityOrderStatusByMemberEnum {
    // 開放報名中
    Pending = 0,
    // 報名額滿
    RegistrationFull = 1,
    // 報名截止
    Rejected = 2,
    // 活動取消
    Cancelled = -1,
    // 活動已完成
    Completed = -2,
}

// 即刻快閃服務商報名狀態 status 定義
export enum rightNowActivityOrderEnrollersStatusEnum {
    // 未確認
    UnConfirmed = 0,
    // 已確認
    Confirmed = 1,
    // 被拒絕
    Rejected = -1,
}

// 可取消即刻快閃訂單狀態
export enum canCancelRightNowActivityOrderStatusEnum {
    // 開放報名中
    Pending = 0,
    // 報名額滿
    RegistrationFull = 1,
}
