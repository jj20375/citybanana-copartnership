"use client";
import { isEmpty } from "@/service/utils";
import { useTranslation } from "@/i18n/i18n-client";
import { tmc } from "@/service/utils";
import React from "react";
/**
 * 顯示即刻快閃單 總計
 * @param param0
 * @returns
 */
export default function RightNowActivityOrderTotal({ lng, total, price, customClass, renderDescription, labelText }: { lng: string; total?: string | void; price: number; customClass?: string | void; renderDescription?: React.ReactNode | void; labelText: string }) {
    const { t } = useTranslation(lng, "main");
    return (
        <>
            <div className={tmc(["flex mt-[30px]", customClass])}>
                <span className="text-gray-primary text-lg-content flex-1">{labelText}</span>
                <span className="text-primary text-lg-content ">
                    {price > 0 ? "NTD" : ""}
                    {total !== undefined && <span className="OpenSans font-medium">{total}</span>}
                </span>
            </div>
            {renderDescription}
        </>
    );
}
