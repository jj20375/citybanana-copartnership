"use client";
import { memo } from "react";

import { useTranslation } from "@/i18n/i18n-client";
// 招募截止時間倒數計時 ui
import RecruitmentCountdown from "./RightNowActivityOrderRecruitmentCountdown";

/**
 * 報名畫面 ui
 */
const RightNowActivityOrderRecruitment = memo(({ lng, customClass, render }: { lng: string; customClass?: string | void; render?: Function | void }) => {
    const { t } = useTranslation(lng, "main");
    const title = t("rightNowActivityOrderRecruitmentDetail.recruitment.title") + "：";
    const recruitCountDownSeconds = 60 * 60;

    return (
        <div className={`${customClass}`}>
            <h6 className="text-lg-content text-gray-secondary text-center">{title}</h6>
            <RecruitmentCountdown initialSeconds={recruitCountDownSeconds} />
            {render ? render() : null}
        </div>
    );
});

export default RightNowActivityOrderRecruitment;
