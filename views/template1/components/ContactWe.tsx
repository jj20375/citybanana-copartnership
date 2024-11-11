"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import Link from "next/link";

const ContactWe = memo(({ lng }: { lng: string }) => {
    const { t } = useTranslation(lng, "main");
    const serviceChatID = process.env.NEXT_PUBLIC_SERVICE_CHAT_ID;

    return (
        <Link
            href={`/join-providers-chatroom/${serviceChatID}`}
            className="text-primary text-lg-content underline flex justify-center w-full mt-[40px]"
        >
            {t("rightNowActivityOrder.contact")}
        </Link>
    );
});

export default ContactWe;
