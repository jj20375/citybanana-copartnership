import * as yup from "yup";
import { addDays, addHours } from "date-fns";
// 手機格式驗證
export const formPhoneValiation = ({ requiredMessage, matchMessage }: { requiredMessage: string; matchMessage: string }) => {
    return yup
        .string()
        .required(requiredMessage)
        .matches(/^[1-9]\d{8}$/, requiredMessage);
};
// 密碼格式驗證
export const formPasswordValiation = yup
    .string()
    .required("密碼為必填")
    .test("password-complexity", "需為 6-18 位數字，且至少包含一個英文", function (value) {
        return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,18}$/.test(value) ? true : false;
    });

// 判斷為台灣國碼時 檢查手機號碼開頭是否為 0
export const formCheckPhoneHaveFirstZero = ({ phoneValue, countryCode }: { phoneValue: string; countryCode: string }) => {
    if (countryCode == "886" && phoneValue) {
        // 移除手機號碼開頭 0
        const newValue = phoneValue.replace(/^0+/, "");
        if (newValue !== phoneValue) {
            return newValue;
        }
        return phoneValue;
    }
    return phoneValue;
};

// 檢查手機國碼 重置 手機驗證格式
export const formCheckCountryCodeResetPhoneValidation = ({ countryCode, formSchema }: { countryCode: string; formSchema: any }) => {
    // 判斷非台灣國碼重置手機號碼驗證格式
    if (countryCode !== "886") {
        const newSchema = {
            ...formSchema,
            phone: yup.string().required("手機為必填").matches(/^\d+$/, "請輸入正確手機號碼格式"),
        };
        return newSchema;
    }
    return formSchema;
};

// 判斷招募截止日期是否超過活動開始日期
export const formDueAtCheckHaveAfterStartDateValidation = ({ startDate, formSchema }: { startDate: Date; formSchema: any }) => {
    return {
        ...formSchema,
        dueAt: yup
            .date()
            .required("招募截止日期為必填")
            .test("is-afater-start-date", "招募截止日期須跟開始日期一樣或更早", function (value) {
                console.log("is-afater-start-date =>", value);
                return value ? value <= startDate : false;
            }), // 限制必須比開始日期更早或同一天
    };
};

// 判斷即刻快閃開始日期加上自定義緩衝時間後不可大於 30 天後
export const formStartDateCheckHaveAfterThirtyDaysValidation = ({ waitHour, formSchema }: { waitHour: number; formSchema: any }) => {
    return {
        ...formSchema,
        dueAt: yup
            .date()
            .required("活動開始不可超過30天後")
            .test("is-start-date-after-thirtydays", "活動開始不可超過30天後", function (value) {
                console.log("is-start-date-after-thirtydays =>", value);
                return value ? value <= addDays(addHours(new Date(), waitHour), 29) : false;
            }), // 限制活動開始日期加上緩衝時間不可大於 30 天後
    };
};
