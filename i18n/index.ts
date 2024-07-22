import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getI18nOptions } from "./i18n-settings";

const initI18next = async (lng: string, ns: string) => {
    const i18nInstance = createInstance();
    await i18nInstance
        .use(initReactI18next)
        .use(resourcesToBackend((lng: string, ns: string) => import(`@/locales/${lng}/${ns}.js`)))
        .init(getI18nOptions(lng, ns));
    return i18nInstance;
};

export async function useTranslation(lng: string, ns: string, options = {}) {
    const i18nextInstance = await initI18next(lng, ns);
    return {
        t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
        i18n: i18nextInstance,
    };
}
