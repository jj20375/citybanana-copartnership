import useMyFetch from "@/service/http-request";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;
import type {
    RightNowActivityOrderChooseProvidersToPaymentAndCreateOrdersAPIResInterface,
    RightNowActivityOrderCreateByCashAPIReqInterface,
    RightNowActivityOrderCreateByCashAPIResInterface,
    RightNowActivityOrderCreateByOtherAPIReqInterface,
    RightNowActivityOrderCreateByOtherAPIResInterface,
} from "./bookingAPI-interfce";
import type {
    OrderCancelAPIResInterface,
    RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPIReqInterface,
    RightNowActivityOrderCreateByCreditCardAndCreateCreditCardAPIResInterface,
    RightNowActivityOrderCreateByCreditCardAPIReqInterface,
    RightNowActivityOrderCreateByCreditCardAPIResInterface,
} from "./bookingCreditCarAPI-interface";

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

/**
 * 選擇服務商並付款開立一般預訂單
 */
export async function RightNowActivityOrderChooseProvidersToPaymentAndCreateOrdersAPI({ ids }: { ids: string[] }): Promise<RightNowActivityOrderChooseProvidersToPaymentAndCreateOrdersAPIResInterface> {
    return useMyFetch(`${apiURL}/partner/demands/datings/enrollers`, {
        method: "patch",
        body: JSON.stringify({ ids }),
    });
}

/**
 * 取消即刻快閃單
 * @param orderID
 * @returns
 */
export async function RightNowActivityOrderCancelAPI(orderID: string): Promise<{ message: string }> {
    return useMyFetch(`${apiURL}/my/demands/datings/${orderID}`, {
        method: "delete",
    });
}

/**
 * 取消即刻快閃單並且連同取消一般預訂單
 * @param orderID
 * @returns
 */
export async function RightNowActivityOrderCancelAndCancelAcceptedOrderAPI(orderID: string): Promise<{ message: string }> {
    return useMyFetch(`${apiURL}/my/demands/datings/${orderID}`, {
        method: "delete",
        params: {
            cascade: "1",
        },
    });
}

/**
 * 取消一般預訂單
 */
export async function OrderCancelAPI(orderID: string): Promise<OrderCancelAPIResInterface> {
    return useMyFetch(`${apiURL}/partner/demands/datings/${orderID}`, {
        method: "delete",
    });
}

/**
 * 一般訂單後反悔機制
 */
export async function OrderUndoCancelAPI(orderID: string): Promise<{ message: string }> {
    return useMyFetch(`${apiURL}/partner/demands/datings/undo-cancel/${orderID}`, {
        method: "post",
    });
}
