import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getI18nOptions } from "./i18n-settings";
import { formatMillion } from "@/service/utils";

const initI18next = async (lng: string, ns: string) => {
    const i18nInstance = createInstance();
    await i18nInstance
        .use(initReactI18next)
        .use(resourcesToBackend((lng: string, ns: string) => import(`@/locales/${lng}/${ns}.json`)))
        .init(getI18nOptions(lng, ns));
    return i18nInstance;
};

export async function useTranslation(lng: string, ns: string, options = {}) {
    const i18nextInstance = await initI18next(lng, ns);

    // 新增千位數逗號 以及千位數轉成k方式顯示 formatter
    i18nextInstance.services.formatter!.add("formatMillionByRightNowActivityPrice", (value, lng, options): any => {
        // 判斷有傳入此 key 時代表服務商報價 要用 服務商報價語系回傳
        if (options.customPrice === 0) {
            return i18nextInstance.t("rightNowActivityOrder.price-0");
        }
        // 判斷有傳入此 key 時代表服務商報價 且為開單細節 預付款金額要用 服務商報價語系回傳
        if (options.customPriceByDetail === 0) {
            return i18nextInstance.t("rightNowActivityOrderPayment.price-0");
        }
        // 判斷有傳入此 key 時代表服務商報價 且為開單細節 出席鐘點費要用 服務商報價語系回傳
        if (options.customPriceByDetailHourPrice === 0) {
            return i18nextInstance.t("rightNowActivityOrderRecruitmentDetail.value-price-0");
        }
        return `$ ${formatMillion(value)}`;
    });
    return {
        t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
        i18n: i18nextInstance,
    };
}
