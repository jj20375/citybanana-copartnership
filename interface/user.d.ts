export interface UserProfileInterface {
    // number
    id?: number;
    online?: 0 | 1;
    // 使用者 id
    banana_id?: string;
    // 經紀 id
    broker_id?: null;
    // 暱稱
    name?: string;
    // 真實姓名
    real_name?: string | null;
    // 帳號與手機
    phone?: string;
    // email
    email?: string | null;
    // 生日
    birthday?: string;
    // 年齡
    age?: number | null;
    // 居住區域
    district?: string;
    // 性別
    gender?: "male" | "female";
    // 身高
    height?: number;
    // 體重
    weight?: number;
    // 職業設定
    occupation?: {
        id: null | number;
    }[];
    // 國家區域
    locale?: string;
    // 自我介紹描述
    description?: string;
    // 服務商守則
    taboo?: null | string;
    // 是否要收到行銷相關資訊
    marketing_notification?: 0 | 1;
    wallet?: {
        // 剩餘點數
        balance: number;
        // 折抵金
        voucher: number;
    };
    media?: {
        photos: string[];
        videos: string[];
    };
    // 身份(0=會員 1=服務商 2=下架服務商)
    role?: number;
    // 身分證或居留證號碼
    government_cert?: null;
    // 地址
    address?: string;
    // 服務區域
    service_area?: string;
    // 評分分數
    rating_score?: number;
    // 銀行資料
    banking?: {
        // 分行名稱
        branch: string | null;
        // 分行代碼
        bankCode: string | null;
        // 帳號
        accountId: string;
        // 帳號名稱
        accountName: string;
        // 銀行名稱
        bankName: string;
    };
    social?: {
        // ig id
        instagram: null | string;
        // 歡迎訊息設定值
        welcome_message: string;
        // 是否發起歡迎訊息
        welcome_message_enabled: 1 | 0;
    };
    // 使用者狀態值
    status?: number;
    created_at?: string;
    updated_at?: string;
    // 設定值
    setting?: {
        plan: null | any;
        // 是否開啟客服自動回應
        enableCityAi: 0 | 1;
        // 與上一場預訂延遲時間
        datingAfterHours: number;
        // 是否開啟簡訊通知
        receiveDatingCreatedSMS: 1 | 0;
        // 是否開啟即刻快閃活動通知
        receiveDemandNotification: 0 | 0;
    };
    // 平均分數
    ranking?: number;
    // 自訂可參與活動
    custom_activities?: string[];
    // 判斷使用者是否為隱藏
    stealth?: 0 | 1;
    valid_jwt_after?: null;
    promoter_id?: null;
    // 自訂專業諮詢
    custom_skills?: string[];
    // 判斷是否有密碼
    has_password?: boolean;
    // 可參與活動
    acceptable_activities?: {
        activities: {
            id: number;
            name: string;
            // 開啟狀態
            enabled: 0 | 1;
        }[];
        // 自訂可參與活動
        custom_activities: string[];
    };
    // 專業諮詢
    experienced_skills?: {
        skills?: {
            id: number;
            name: string;
            // 開啟狀態
            enabled: 0 | 1;
        }[];
        // 自訂專業諮詢
        custom_skills?: string[];
    };
    avatar?: string;
    cover?: string;
    photos?: {
        id: string;
        url: null | string;
        sorting: number;
    }[];
    videos?: {
        id: string;
        url: null | string;
        cover: null | string;
        sorting: number;
    }[];
    thumbnails?: {
        avatar: {
            "360x360": string;
            "720x720": string;
        };
        cover: {
            "360x360": string;
            "720x720": string;
        };
        photos: {
            "360x360": { id: string; url: null | string; sorting: number }[];
            "720x720": { id: string; url: null | string; sorting: number }[];
        };
        videos: {
            "360x360": { id: string; url: null | string; cover: null | string; sorting: number }[];
            "720x720": { id: string; url: null | string; cover: null | string; sorting: number }[];
        };
    };
    // 是否開啟現金付款
    enablePayByCash?: 0 | 1;
    /**
     * 判斷是否為首次註冊會員資料不完整會員（合作店家註冊)
     * 1 = 資料不完整
     * 再合作店家開單時 資料不完整會員 需補上暱稱與性別才能開單
     */
    newbie: number;
    matrices?: {
        response_time: string;
        response_rate: string;
        num_of_cancel: number;
    };
    categories?: {
        id: number;
        name: string;
        pivot: {
            user_id: number;
            category_id: number;
            price: number;
            // 最少預訂時數
            min_dating_unit: number;
            // 開啟狀態
            status: number;
            created_at: string;
            updated_at: string;
        };
    }[];
    facebook_user?: null | any;
    google_user?: null | any;
    line_user?: null | any;
    apple_user?: null | any;
    // 標籤名稱
    badges?: {
        id: number;
        name: string;
        pivot: {
            user_id: number;
            badge_id: number;
        };
    }[];
    // 可參與活動
    activities?: {
        id: number;
        name: string;
        icons: {
            x1: null | string;
            x2: null | string;
            x3: null | string;
            x1matting: null | string;
            x2matting: null | string;
            x3matting: null | string;
            svg: null | string;
        };
        pivot: {
            user_id: number;
            activity_id: number;
        };
    }[];
    skills?: {
        id: number;
        name: string;
        icons: {
            x1: null | string;
            x2: null | string;
            x3: null | string;
            x1matting: null | string;
            x2matting: null | string;
            x3matting: null | string;
        };
        pivot: {
            user_id: number;
            skill_id: number;
        };
    }[];
    languages?: any[];
    // 服務商經紀
    broker?: null | any;
}
