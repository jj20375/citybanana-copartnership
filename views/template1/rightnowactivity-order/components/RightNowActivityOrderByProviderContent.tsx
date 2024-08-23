"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "@/views/template1/rightnowactivity-recruitment-order/rightnowactivity-order-interface";
import Image from "next/image";
import { tmc } from "@/service/utils";
import { useRouter } from "next/navigation";
/**
 * 訂單上方服務商資料區塊 ui
 */
const OrderByProviderContent = memo(({ lng, providerData, customClass }: { lng: string; providerData: RightNowActivityOrderDetailProviderSigupCardInterface; customClass?: string | void }) => {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    const goToChatroom = (id: string) => {
        router.push(`/join-providers-chatroom/${id}`);
    };
    return (
        <section className={tmc(typeof customClass === "string" && customClass, "flex")}>
            <Image
                src={providerData.cover}
                alt="provider avatar"
                width={100}
                height={100}
                style={{ width: "80px", height: "auto" }}
                className="rounded-md mr-[12px]"
            />
            <div className="flex flex-col flex-1 h-[80px] justify-between">
                <h5 className="text-gray-primary font-light text-[15px]">{providerData.name}</h5>
                <div className="flex mt-2">
                    <Image
                        src="/img/icons/rate.svg"
                        width={20}
                        height={20}
                        style={{ width: "10px", height: "auto" }}
                        alt="rate"
                        className="mr-1"
                    />
                    <span className="text-gray-primary text-sm-content">{providerData.rate}</span>
                </div>
                <Image
                    src="/img/icons/queen.svg"
                    width={100}
                    height={100}
                    style={{ width: "70px", height: "auto" }}
                    alt="queen"
                    className="mt-2"
                />
            </div>
            <div className="h-[80px] flex items-center">
                <button
                    onClick={() => goToChatroom(String(providerData.id))}
                    className="border rounded-md border-primary h-[27px] text-primary text-sm-content w-[84px]"
                >
                    {t("global.sendMessage")}
                </button>
            </div>
        </section>
    );
});

export default OrderByProviderContent;
