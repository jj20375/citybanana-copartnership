/**
 * 合作店家 api
 */
import useMyFetch from "@/service/http-request";
import type { GetPartnerStoreInfoAPIResInterface } from "./partnerStoreAPI-interface";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;

/**
 * 取得合作店家資料
 */
export async function getPartnerStoreInfoAPI({ storeCode, venueID }: { storeCode: string; venueID?: string | void }): Promise<GetPartnerStoreInfoAPIResInterface> {
    let url = `${apiURL}/partner/merchants/${storeCode}`;
    if (venueID) {
        const params = { venue: venueID };
        url = `${url}?${new URLSearchParams(params).toString()}`;
    }
    return useMyFetch(url, {
        method: "get",
    });
}
