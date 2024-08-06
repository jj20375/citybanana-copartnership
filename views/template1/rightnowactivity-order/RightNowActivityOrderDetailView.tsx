"use client";
import { useTranslation } from "@/i18n/i18n-client";
import TitleCompoent from "../components/TitleComponent";
import RightNowActivityOrderTopContent from "./components/RightNowActivityOrderTopContent";

export default function RightNowActivityOrderDetailView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");

    const title = t("rightNowActivityOrderDetail.title");
    return (
        <>
            <TitleCompoent title={title} />
            <div className="mx-auto max-w-[400px] mt-[40px]">
                <RightNowActivityOrderTopContent lng={lng} />
            </div>
        </>
    );
}
