import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { GetSmsLinkByRightNowActivityOrderToGetUserTokenAPI } from "@/api/userAPI/userAPI";

export async function redirectTypeMiddleware(req: NextRequest, res: any, lang: string = "zh-TW") {
    // 解析 URL 以取得 query 參數
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    try {
        const token = cookies().get("accessToken")?.value;
        if (token) {
            console.log("work redirectTypeMiddleware token =>", token);
        }
    } catch (err) {
        console.log("get cookies =>", err);
    }

    return res.next();
}
