"use server";
import { useTranslation } from "@/i18n";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

/**
 * 點擊簡訊連結 code 失效後顯示畫面
 * @param param0
 * @returns
 */
export default async function SmsOrderErrorView({ lng, orderID }: { lng: string; orderID: string }) {
    const { t } = await useTranslation(lng, "main");

    return (
        <div className="mt-[55px] mx-auto max-w-[400px] text-center">
            <Image
                src="/img/icons/order-cancel.svg"
                alt="order create success"
                width={100}
                height={100}
                style={{ width: "50px", height: "auto" }}
                className="mx-auto"
            />
            <h1 className="text-md-title text-gray-primary mt-[30px] font-semibold">{t("smsOrder.error.title")}...</h1>
            <p className="text-[#7c7c7c] text-[20px] mt-[30px] whitespace-pre-wrap">{t("smsOrder.error.description")}</p>
        </div>
    );
}
