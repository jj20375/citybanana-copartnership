import Image from "next/image";
import PayWorkingView from "@/views/template1/pay-working/PayWorkingView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <PayWorkingView lng={lng} />;
}
