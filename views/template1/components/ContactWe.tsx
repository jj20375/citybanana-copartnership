"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";

const ContactWe = memo(({ lng }: { lng: string }) => {
    const { t } = useTranslation(lng, "main");
    return <button className="text-primary text-lg-content underline flex justify-center w-full mt-[40px]">{t("rightNowActivityOrder.contact")}</button>;
});

export default ContactWe;
