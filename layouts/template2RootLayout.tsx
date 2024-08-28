import { Suspense } from "react";
import AuthLayoutServerProvider from "@/providers/authLayoutServerProvider";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { dir } from "i18next";
const inter = Inter({ subsets: ["latin"] });
export default function Tmp2RootLayout({ children, lang }: { children: React.ReactNode; lang: string }) {
    return (
        <html
            lang={lang}
            dir={dir(lang)}
        >
            <body className={inter.className}>
                <Suspense fallback={<p>Loading feed...</p>}>
                    layout2
                    <AuthLayoutServerProvider>{children}</AuthLayoutServerProvider>
                </Suspense>
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_CODE!} />
            </body>
        </html>
    );
}
