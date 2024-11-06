// 會員一般預訂單 status 定義
export enum orderStatusByMemberEnum {
    // 全部狀態
    All = "null",
    // 未付款
    Unpaid = 0,
    // 等待確認
    WaitingConfirm = 1,
    // 已確認
    Confirmed = 2,
    // 進行中
    InProgress = 3,
    // 已完成
    Completed = 4,
    // 已完成結案(目前用不到)
    CompletedClose = 5,
    // 已完成爭議處理
    DisputeResolution = 6,
    // 服務商取消或系統取消
    ProviderOrSystemCancelled = -1,
    // 會員取消
    MemberCancelled = -2,
    // 會員臨時取消
    MemberTemporaryCancelled = -3,
    // 爭議處理中
    DisputePending = -4,
}

// 會員可以取消訂單的狀態
export enum orderCanCancelStatusEnum {
    // 未付款
    Unpaid = 0,
    // 等待確認
    WaitingConfirm = 1,
    // 已確認
    Confirmed = 2,
}
