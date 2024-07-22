import { useTranslation } from "@/i18n";
export default async function Work3Layout({ children, params: { lng } }: { children: React.ReactNode; params: { lng: string } }) {
    const { t } = await useTranslation(lng, "main");

    return (
        <section>
            <h1>{t("title")}</h1>

            <div> work3 layout</div>
            {children}
        </section>
    );
}
