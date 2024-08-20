import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

// 轉換信用卡顯示方式
export const formatCardNumber = (value: string | any) => {
    // 移除非數字字串
    value = value.replace(/[^\d]/g, "");
    return !isEmpty(value) ? value.replace(/(\d{4})(?=\d)/g, "$1-") : "";
};

// 轉換信用卡到期日格式
export const formatCardExpiryDate = (value: string | any) => {
    // 移除非數字字串
    value = value.replace(/[^\d]/g, "");

    // 判斷有值時 且 值 大於  1 時 如果使用者月份忘記給 0 前綴時 幫忙補上 ex: 2 = 02
    if (value.length === 1 && parseInt(value) > 1 && parseInt(value) < 10) {
        value = "0" + value;
    }

    // 月份後面加上斜線 ex: 02/25
    if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
    }

    // 信用卡有效日期最多五位數 (MM/YY)
    if (value.length > 5) {
        value = value.slice(0, 5);
    }

    return value;
};

/**
 * 透過 tailwind-merge 與 clsx 方法來動態更新 className
 */
export function tmc(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
