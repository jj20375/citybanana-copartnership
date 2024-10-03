// 會員一般預訂單 status 定義
export const rightNowActivityOrderStatusByMemberEnum = {
    // 全部狀態
    All: "null",
    // 未付款
    Unpaid: 0,
    // 等待確認
    WaitingConfirm: 1,
    // 已確認
    Confirmed: 2,
    // 進行中
    InProgress: 3,
    // 已完成
    Completed: 4,
    // 會員取消
    MemberCancelled: -1,
    // 服務商取消
    ProviderCancelled: -2,
    // 系統自動取消
    SystemCancelled: -3,
};
