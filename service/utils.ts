//判斷是否為空值或空物件
export const isEmpty = (value: any) => {
    return value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0) || value.length === 0;
};

/**
 * 判斷是否為 android 手機
 */
export const isAndroidDevice = () => {
    // Get the user agent
    let userAgent = window.navigator.userAgent;

    // 驗證是否為 android
    let regex = new RegExp(/android/i);

    if (regex.test(userAgent)) {
        return true;
    }
    return false;
};
