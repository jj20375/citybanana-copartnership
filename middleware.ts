import acceptLanguage from "accept-language";
import { fallbackLang, languages, cookieName } from "@/i18n/i18n-settings";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redirectTypeMiddleware } from "@/config/middleware.config";

acceptLanguage.languages(languages);

export const config = {
    // matcher: '/:lng*'
    matcher: ["/((?!api|assets|favicon.ico|sw.js).*)"],
};
export function middleware(req: NextRequest) {
    // retrieve the current response
    const res = NextResponse.next();

    // add the CORS headers to the response
    res.headers.append("Access-Control-Allow-Credentials", "true");
    res.headers.append("Access-Control-Allow-Origin", "*"); // replace this your actual origin
    res.headers.append("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
    res.headers.append("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

    // console.log("middleware work =>", req.nextUrl);
    let lang;
    if (req.cookies.has(cookieName)) lang = acceptLanguage.get(req.cookies.get(cookieName)!.value);
    if (!lang) lang = acceptLanguage.get(req.headers.get("Accept-Language"));
    if (!lang) lang = fallbackLang;

    const token = req.cookies.getAll();

    console.log("middletoken token =>", token);

    // Redirect if lng in path is not supported
    if (!languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) && !req.nextUrl.pathname.startsWith("/_next")) {
        // 判斷圖片路徑 不加上 語系前綴
        if (!req.nextUrl.pathname.startsWith("/img")) {
            return NextResponse.redirect(new URL(`/${lang}${req.nextUrl.pathname}`, req.url));
        }
    }

    // 設定語系檔進入cookie
    function setLangInCookies() {
        const refererUrl = new URL(req.headers.get("referer")!);
        // 取得當前網址語系
        const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
        if (lngInReferer) {
            res.cookies.set(cookieName, lngInReferer);
        }
    }

    // 判斷需要導頁時觸發
    if (req.nextUrl.pathname === `/${lang}/rd`) {
        if (req.headers.has("referer")) {
            console.log("referer =>", req.headers.has("referer"), req.nextUrl.pathname);
            // 設定語系進入 cookie
            setLangInCookies();
        }
        return redirectTypeMiddleware(req, NextResponse, lang);
    }
    if (req.headers.has("referer")) {
        console.log("work referer");
        // 設定語系進入 cookie
        setLangInCookies();
        return res;
    }

    return res;
}
