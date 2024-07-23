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

// 計算千位數轉成k方式顯示
export const formatMillion = (val: undefined | number) => {
    // 判斷沒有值時 不執行
    if (val === undefined) {
        return;
    }
    // 判斷大於 1000時 將數字轉換成 k單位
    if (val >= 1000000) {
        const k = parseInt(String(val / 1000));
        const num = k.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
            return pre + groupOf3Digital.replace(/\d{3}/g, ",$&");
        });
        return num + "K";
    }
    // 一般情況下超過千位數 加上一個逗號
    const num = val.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
        return pre + groupOf3Digital.replace(/\d{3}/g, ",$&");
    });
    return num;
};

// 計算千位數轉成k方式顯示 以及 判斷是否為服務商報價 當數字為 0 時 需顯示“服務商報價”語系
export const formatMillionByRightNowActivityPrice = (val: undefined | number) => {
    // 判斷沒有值時 不執行
    if (val === undefined) {
        return;
    }
    // 判斷大於 1000時 將數字轉換成 k單位
    if (val >= 1000000) {
        const k = parseInt(String(val / 1000));
        const num = k.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
            return pre + groupOf3Digital.replace(/\d{3}/g, ",$&");
        });
        return num + "K";
    }
    // 一般情況下超過千位數 加上一個逗號
    const num = val.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, function (all, pre, groupOf3Digital) {
        return pre + groupOf3Digital.replace(/\d{3}/g, ",$&");
    });
    return num;
};
