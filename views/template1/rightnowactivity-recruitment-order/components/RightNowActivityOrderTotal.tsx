"use client";
import { isEmpty } from "@/service/utils";
import { useTranslation } from "@/i18n/i18n-client";
/**
 * 顯示即刻快閃單 總計
 * @param param0
 * @returns
 */
export default function RightNowActivityOrderTotal({ lng, total, price }: { lng: string; total?: string | void; price: number }) {
    const { t } = useTranslation(lng, "main");
    return (
        <div className="flex mt-[30px] mb-[40px]">
            <span className="text-gray-primary text-lg-content flex-1">{t("rightNowActivityOrderRecruitmentDetail.expectedPayment")}</span>
            <span className="text-primary text-lg-content ">
                {price > 0 ? "NTD" : ""}
                {total !== undefined && <span className="OpenSans font-medium">{total}</span>}
            </span>
        </div>
    );
}
