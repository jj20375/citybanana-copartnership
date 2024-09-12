import type { AreaInterface } from "@/interface/area";

/**
 * 取得合作店家資料 api 回應參數
 */
export interface GetPartnerStoreInfoAPIResInterface {
    // 合作店家資料
    merchant: {
        code: string;
        name: string;
        government_id?: null | string;
        district: AreaInterface;
        location: string;
        contact: string;
        phone?: null | string;
        email?: null | string;
        social?: null | object;
        service?: null | string;
        status: number;
        details?: null | object;
        created_at: null | string;
    };
    // 店家桌號或包廂
    venue?: null | {
        code: string;
        name: string;
        district?: null | AreaInterface;
        location?: null | string;
        service?: null | object;
        status: number;
        details?: null | object;
        created_at: null | string;
    };
}
