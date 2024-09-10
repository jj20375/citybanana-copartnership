import { AreaInterface } from "@/interface/area";
/**
 * 合作店家 api
 */
import useMyFetch from "@/service/http-request";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;

/**
 * 取得合作店家資料
 */
export async function getPartnerStoreInfoAPI({ storeCode, venueID }: { storeCode: string; venueID?: string | void }): Promise<GetPartnerStoreInfoAPIInterface> {
    let url = `${apiURL}/partner/merchants/${storeCode}`;
    if (venueID) {
        const params = { venue: venueID };
        url = `${url}?${new URLSearchParams(params).toString()}`;
    }
    return useMyFetch(url, {
        method: "get",
    });
}

export interface GetPartnerStoreInfoAPIInterface {
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
