import { Suspense } from "react";
import AuthLayoutServerProvider from "@/providers/authLayoutServerProvider";
import Header from "@/layouts/template1/Header";
import ReduxProvider from "@/providers/reduxProvider";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { dir } from "i18next";
import { Noto_Sans_TC } from "next/font/google";

const notoSansTc = Noto_Sans_TC({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    style: ["normal"],
    subsets: ["latin"],
    display: "swap",
});

export default function Tmp1RootLayout({ children, lang }: { children: React.ReactNode; lang: string }) {
    return (
        <html
            lang={lang}
            dir={dir(lang)}
        >
            <body className={notoSansTc.className}>
                <Suspense fallback={<p>Loading feed...</p>}>
                    <ReduxProvider>
                        <Header />
                        <AuthLayoutServerProvider>{children}</AuthLayoutServerProvider>
                    </ReduxProvider>
                </Suspense>

                {/* <Script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_CODE}`}
                />

                <Script id="google-analytics">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag() {
                            dataLayer.push(arguments);
                        }
                        gtag("js", new Date());
            
                        gtag("config", ${process.env.NEXT_PUBLIC_GA_CODE}, { debug_mode: true });
                        `}
                </Script> */}
                <GoogleAnalytics
                    gaId={process.env.NEXT_PUBLIC_GA_CODE!}
                    dataLayerName="gaDataLayer"
                />
            </body>
        </html>
    );
}
