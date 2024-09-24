import useMyFetch from "@/service/http-request";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;
import type { RightNowActivityOrderCreateByCashAPIReqInterface, RightNowActivityOrderCreateByCashAPIResInterface, RightNowActivityOrderCreateByOtherAPIReqInterface, RightNowActivityOrderCreateByOtherAPIResInterface } from "./bookingAPI-interfce";
import type {
    RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPIReqInterface,
    RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPIResInterface,
    RightNowActivityOrderCreateByCreditCardAPIReqInterface,
    RightNowActivityOrderCreateByCreditCardAPIResInterface,
} from "./creditCarAPI-interface";

/**
 * 現金開立即刻快閃單
 * @param data
 * @returns
 */
export async function RightNowActivityOrderCreateByCashAPI(data: RightNowActivityOrderCreateByCashAPIReqInterface): Promise<RightNowActivityOrderCreateByCashAPIResInterface> {
    return useMyFetch(`${apiURL}/cash/demands/datings`, {
        method: "post",
        body: JSON.stringify(data),
    });
}
/**
 * 非現金開立即刻快閃單
 * @param data
 * @returns
 */
export async function RightNowActivityOrderCreateByOtherAPI(data: RightNowActivityOrderCreateByOtherAPIReqInterface): Promise<RightNowActivityOrderCreateByOtherAPIResInterface> {
    return useMyFetch(`${apiURL}/demands/datings`, {
        method: "post",
        body: JSON.stringify(data),
    });
}

/**
 * 使用新增信用卡開立即刻快閃單
 */
export async function RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPI(data: RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPIReqInterface): Promise<RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPIResInterface> {
    return useMyFetch(`${apiURL}/partner/credit-cards`, {
        method: "post",
        body: JSON.stringify(data),
    });
}
/**
 * 使用指定信用卡開立即刻快閃單
 */
export async function RightNowActivityOrderCreateByCreditCardAPI(data: RightNowActivityOrderCreateByCreditCardAPIReqInterface): Promise<RightNowActivityOrderCreateByCreditCardAPIResInterface> {
    return useMyFetch(`${apiURL}/partner/credit-cards`, {
        method: "post",
        body: JSON.stringify(data),
    });
}
