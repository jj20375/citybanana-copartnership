// 手機號碼驗證 interface
export interface PhoneValidationInterface {
    form: {
        // 手機號碼
        phone: string;
        // 手機國碼
        countryCode: string;
        // 手機驗證碼
        validateCode: string;
    };
}
