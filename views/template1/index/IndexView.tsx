import { useTranslation } from "@/i18n";
import Link from "next/link";
export default async function IndexView({ lng }: { lng: string }) {
    const { t } = await useTranslation(lng, "main");

    return (
        <div className="text-white mx-auto max-w-[400px] text-center flex flex-col justify-end h-screen bg-gradient-to-t from-black to-white">
            <h1 className="text-lg-title">{t("index.title")}</h1>
            <h2 className="text-lg-title">{t("index.second-title")}</h2>
            <Link
                href="/create-rightnowactivity-order"
                className="mx-auto"
            >
                <button className="rounded-md PrimaryGradient h-[45px] w-[271px] flex items-center justify-center mt-[40px] mb-[64px]">{t("index.start")}</button>
            </Link>
        </div>
    );
}
