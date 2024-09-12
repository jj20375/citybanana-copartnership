import useMyFetch from "@/service/http-request";
import type { GetVerificationCodeAPIReqInterface, GetVerificationCodeAPIResInterfacce, VerificationSMSCodeAPIReqInterface, VerificationSMSCodeAPIResInterface } from "@/api/authAPI/authAPI-interface";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function RefreshTokenAPI(token?: string | null) {
    const options: { method: string; token?: string } = { method: "post" };
    if (token) {
        options.token = token;
    }
    return useMyFetch(`${apiURL}/auth/refresh`, options);
}

/**
 * 取得簡訊驗證碼
 */
export async function GetVerificationCodeAPI({ phone, country_code, client, reset_password, recaptchaToken }: GetVerificationCodeAPIReqInterface): Promise<GetVerificationCodeAPIResInterfacce> {
    const body: GetVerificationCodeAPIReqInterface = {
        phone,
        country_code,
        client,
        reset_password,
        recaptchaToken,
    };

    Object.keys(body).forEach((key) => {
        if (key === undefined) {
            delete body[key];
        }
    });
    return useMyFetch(`${apiURL}/auth/request`, {
        method: "post",
        body: JSON.stringify({ ...body, "g-recaptcha-response": recaptchaToken }),
    });
}

/**
 * 驗證簡訊驗證碼
 */
export async function VerificationSMSCodeAPI({ phone, country_code, crumb, code, role }: VerificationSMSCodeAPIReqInterface): Promise<VerificationSMSCodeAPIResInterface> {
    const body: VerificationSMSCodeAPIReqInterface = {
        phone,
        country_code,
        crumb,
        code,
        role,
    };
    Object.keys(body).forEach((key) => {
        if (key === undefined) {
            delete body[key];
        }
    });
    return useMyFetch(`${apiURL}/partner/verify`, {
        method: "post",
        body: JSON.stringify(body),
    });
}
