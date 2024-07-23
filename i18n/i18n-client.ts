"use client";

import { useEffect, useState } from "react";
import i18next from "i18next";
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import { useCookies } from "react-cookie";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getI18nOptions, languages, cookieName } from "./i18n-settings";
import { formatMillion } from "@/service/utils";

const runsOnServerSide = typeof window === "undefined";

//
i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(resourcesToBackend((lng: string, ns: string) => import(`@/locales/${lng}/${ns}.json`)))
    .init({
        ...getI18nOptions(),
        lng: undefined, // let detect the language on client side
        detection: {
            order: ["path", "htmlTag", "cookie", "navigator"],
        },
        preload: runsOnServerSide ? languages : [],
    });

// 新增千位數逗號 以及千位數轉成k方式顯示 formatter
i18next.services.formatter!.add("formatMillionByRightNowActivityPrice", (value, lng, options): any => {
    // 判斷有傳入此 key 時代表服務商報價 要用 服務商報價語系回傳
    if (options.customPrice === 0) {
        return i18next.t("rightNowActivityOrder.price-0");
    }
    return `$ ${formatMillion(value)}`;
});
// lang = 選擇的語言, ns = 檔案名稱(name space)
export function useTranslation(lng: string, ns: string, options?: {}) {
    const [cookies, setCookie] = useCookies([cookieName]);
    const ret = useTranslationOrg(ns, options);
    const { i18n } = ret;
    if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
        i18n.changeLanguage(lng);
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (activeLng === i18n.resolvedLanguage) return;
            setActiveLng(i18n.resolvedLanguage);
        }, [activeLng, i18n.resolvedLanguage]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (!lng || i18n.resolvedLanguage === lng) return;
            i18n.changeLanguage(lng);
        }, [lng, i18n]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (cookies.i18next === lng) return;
            setCookie(cookieName, lng, { path: "/" });
        }, [lng, cookies.i18next, setCookie]);
    }
    return ret;
}
