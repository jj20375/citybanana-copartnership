export const fallbackLang = "en";
export const languages = [fallbackLang, "zh-Hant"];
export const cookieName = "i18next";
// 預設語系檔 檔名
export const defaultNS = "main";

// lang = 選擇的語言, ns = 檔案名稱(name space)
export function getI18nOptions(lang = fallbackLang, ns = defaultNS) {
    return {
        // debug: true,
        supportedLngs: languages,
        fallbackLang,
        lng: lang,
        fallbackNS: defaultNS,
        defaultNS,
        ns,
    };
}
