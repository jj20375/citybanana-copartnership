"use client";
import { memo } from "react";

import { useTranslation } from "@/i18n/i18n-client";
// 招募截止時間倒數計時 ui
import RecruitmentCountdown from "./RightNowActivityOrderRecruitmentCountdown";

/**
 * 報名畫面 ui
 */
const RightNowActivityOrderRecruitment = memo(({ lng, customClass, render, conuntDownSecond }: { lng: string; customClass?: string | void; render?: Function | void; conuntDownSecond: number }) => {
    const { t } = useTranslation(lng, "main");
    const title = t("rightNowActivityOrderRecruitmentDetail.recruitment.title") + "：";

    return (
        <div className={`${customClass}`}>
            <h6 className="text-lg-content text-gray-secondary text-center">{title}</h6>
            <RecruitmentCountdown initialSeconds={conuntDownSecond} />
            {render ? render() : null}
        </div>
    );
});

export default RightNowActivityOrderRecruitment;
