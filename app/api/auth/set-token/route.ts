import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setToken } from "@/service/actions";

export async function POST(request: Request) {
    const body = await request.json();
    const { token, expiresTime } = body;

    // 設定過期時間，預設為30天
    const maxAge = expiresTime ?? 60 * 60 * 24 * 30;

    // 設定伺服器端 cookie
    setToken({ token, expiresTime });
    console.log("api set token =>", cookies().get("accessToken")?.value);

    return NextResponse.json({ success: true });
}
