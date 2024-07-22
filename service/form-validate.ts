import * as yup from "yup";
// 手機格式驗證
export const formPhoneValiation = yup
    .string()
    .required("手機為必填")
    .matches(/^[1-9]\d{8}$/, "請輸入正確手機號碼格式");
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
