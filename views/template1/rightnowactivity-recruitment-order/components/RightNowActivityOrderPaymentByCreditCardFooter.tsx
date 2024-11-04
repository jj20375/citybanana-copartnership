"use client";
import { useTranslation } from "@/i18n/i18n-client";
import { memo, useMemo } from "react";
import { RightNowActivityOrderDetailProviderSigupCardInterface } from "../rightnowactivity-order-interface";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { sum } from "lodash";

/**
 * 即刻快閃信用卡付款常駐下方 footer
 */
const RightNowActivityOrderPaymentByCreditCardFooter = memo(({ lng, providers, duration }: { lng: string; providers: RightNowActivityOrderDetailProviderSigupCardInterface[]; duration: number }) => {
    const { t } = useTranslation(lng, "main");

    const chooseProviders = useAppSelector((state) => state.orderStore.chooseProviders);

    console.log("chooseProviders =>", chooseProviders);
    const disabled = useMemo(() => {
        return chooseProviders.length === 0;
    }, [chooseProviders]);

    const total = useMemo(() => {
        const prices = providers
            .filter((provider) => chooseProviders.includes(provider.id as never))
            .map((item) => {
                return item.price * duration;
            });
        return sum(prices);
    }, [providers, chooseProviders]);

    return (
        <section className="max-w-[400px] mx-auto">
            <div className=" w-[400px] flex justify-center p-5 fixed bottom-[80px] bg-white z-10 shadow-sm">
                <strong className="text-primary text-md-title flex-1">{t("rightNowActivityOrder.price", { val: total })}</strong>
                <button
                    className="DisabledBg bg-primary text-white w-[155px] h-[42px] text-lg-content rounded mr-5"
                    disabled={disabled}
                >
                    {t("global.confirmPayment")}
                </button>
            </div>
        </section>
    );
});

export default RightNowActivityOrderPaymentByCreditCardFooter;
