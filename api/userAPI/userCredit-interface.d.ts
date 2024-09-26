/**
 * 使用者信用卡列表 api 回應參數
 */
export interface UserCreditCardListAPIResInterface {
    data: Datum[];
    [property: string]: any;
}

export interface Datum {
    cardholder?: string;
    comment?: string;
    /**
     * 安全碼，信用卡安全碼
     */
    cvc?: string;
    /**
     * 期限，信用卡期限
     */
    expiration?: string;
    id: number;
    /**
     * 預設付款，是否設定為預設付款卡
     */
    is_default?: boolean;
    issuer: string;
    /**
     * 卡號，信用卡卡號
     */
    number: string;
    [property: string]: any;
}

/**
 * 更新使用者資料 api 請求參數
 */
export interface UpdateUserProfileAPIReqInterface {
    /**
     * 可參與活動，服務商定義可參與活動選項
     */
    activities?: number[];
    /**
     * 地址，居住地址
     */
    address?: string;
    /**
     * 年齡，允許謊報
     */
    age?: number;
    /**
     * 收款帳號，服務商收款帳號
     */
    banking?: string;
    /**
     * 生日
     */
    birthday?: string;
    /**
     * 自訂可參與活動，自訂可參與活動名稱
     */
    custom_activities?: string[];
    /**
     * 自訂才藝，自訂才藝名稱
     */
    custom_skills?: string[];
    /**
     * 描述，自傳的概念
     */
    description?: string;
    /**
     * 居住區域，iso 3166-2格式  ex:TW-KEE=基隆
     */
    dirstrict?: string;
    /**
     * 性別，male=男 female=女 unknown=未知
     */
    gender?: string;
    /**
     * 身分證，身分證字號或護照號碼
     */
    government_id?: string;
    /**
     * 身高，身高
     */
    height?: number;
    /**
     * ig，ig id
     */
    instagram?: string;
    languages?: number;
    /**
     * 語系，語系
     */
    locale?: string;
    /**
     * 廣告通知，是否收到廣告通知
     */
    marketing_notification?: boolean;
    /**
     * 暱稱，使用者暱稱
     */
    name?: string;
    /**
     * 職業
     */
    occupation?: Occupation[];
    /**
     * 是否在線
     */
    online?: boolean;
    /**
     * 真實姓名，真實姓名
     */
    real_name?: string;
    /**
     * 服務區域，可用服務區域搜尋該區服務商
     */
    service_area?: string[];
    /**
     * 特殊才藝，服務商特殊才藝
     */
    skills?: number[];
    /**
     * 歡迎訊息，聊天室歡迎訊息
     */
    welcome_message?: string;
    /**
     * 是否啟用歡迎訊息，是否啟用聊天室歡迎訊息
     */
    welcome_message_enabled?: string;
    /**
     * 體重，體重
     */
    wight?: number;
    [property: string]: any;
}

export interface Occupation {
    /**
     * 職業描述，職業代號為JOB-OTHERS 需填寫
     */
    description?: string;
    /**
     * 職業代號，職業代號
     */
    id: string;
    [property: string]: any;
}
