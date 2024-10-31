"use client";
import type { GetRightNowActivityOrderDetailAPIResInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
import { useTranslation } from "@/i18n/i18n-client";
import { useMemo } from "react";
import dayjs from "dayjs";
import RecruitmentCountdown from "./RightNowActivityOrderRecruitmentCountdown";
import { rightNowActivityOrderEnrollersStatusEnum, rightNowActivityOrderStatusByMemberEnum } from "@/status-enum/rightnowactivity-order-enum";

/**
 * 即刻快閃報名狀態上方倒數計時區塊與標題跟描述
 * @param param0
 * @returns
 */
export default function RightNowActivityOrderRecruitmentPendingTitle({ lng, order }: { lng: string; order: GetRightNowActivityOrderDetailAPIResInterface }) {
    const { t } = useTranslation(lng, "main");

    // 判斷要不要顯示倒數時間 (只有24小時以下才顯示)
    const isShowCountDown = useMemo(() => {
        if (!order) {
            return false;
        }
        if (order.due_at && !dayjs(order.due_at).isValid()) {
            return false;
        }
        // 非報名狀態時不出現
        if (order.status !== rightNowActivityOrderStatusByMemberEnum.Pending) {
            return false;
        }
        // 招募截止時間
        const dueAt = dayjs(order.due_at);

        // 判斷 dueAt 是否在現在時間的 24 小時內
        const isWithinLast24Hours = dueAt.isAfter(dayjs().subtract(24, "hours"));
        // 判斷是否小於當前時間 為 true 代表小於
        const isBeforeNow = dueAt.isBefore(dayjs());

        return isWithinLast24Hours && !isBeforeNow;
    }, [order]);

    // 判斷是否顯示服務商可報名時間
    const showDescriptionByDueAt = useMemo(() => {
        // 非報名狀態時不出現
        if (order.status !== rightNowActivityOrderStatusByMemberEnum.Pending) {
            return false;
        }
        return true;
    }, [order]);

    // 判斷是否報名截止且沒人報名
    const showDescriptionByDueAtAndAfter = useMemo(() => {
        if (order.status >= rightNowActivityOrderStatusByMemberEnum.Rejected && Array.isArray(order.enrollers) && order.enrollers.length === 0) {
            return true;
        }
        return false;
    }, [order]);

    // 判斷已報名截止且有服務商報名成功時
    const showDescriptionByEnrollersSuccess = useMemo(() => {
        if (order.status > rightNowActivityOrderStatusByMemberEnum.Pending && Array.isArray(order.enrollers) && order.enrollers.filter((item) => item.status === rightNowActivityOrderEnrollersStatusEnum.Confirmed).length > 0) {
            return true;
        }
        return false;
    }, [order]);

    return (
        <section className="PrimaryGradient py-[27px] text-white">
            <div className="flex justify-center">
                <h1 className="text-[28px] mr-2">{t(`rightNowActivityOrderStatus.rightNowActivityOrderStatusByMemberEnum.${order.status}`)}</h1>
                {/* 倒數計時區塊 */}
                {isShowCountDown && order && (
                    <RecruitmentCountdown
                        targetDate={dayjs(order.due_at).toDate()}
                        customClass="pb-[30px]"
                    />
                )}
            </div>
            {/* 當報名截止時不顯示 */}
            {showDescriptionByDueAt && <p className="text-center">{t("rightNowActivityOrderRecruitmentDetail.recruitment.dueAtDescription", { val: dayjs(order.due_at).format("YYYY-MM-DD HH:mm") })}</p>}
            {/* 當報名截止時且沒人報名這場活動時顯示 */}
            {showDescriptionByDueAtAndAfter && <p className="text-center">{t("rightNowActivityOrderRecruitmentDetail.recruitment.rejectedForProviderSignup", { val: dayjs(order.due_at).format("YYYY-MM-DD HH:mm") })}</p>}
            {/* 當報名結束時且有服務商報名成功時顯示 */}
            {showDescriptionByEnrollersSuccess && <p className="text-center">{t("rightNowActivityOrderRecruitmentDetail.recruitment.activeOrder", { val: dayjs(order.due_at).format("YYYY-MM-DD HH:mm") })}</p>}
        </section>
    );
}
