import Image from "next/image";
import RightNowActivityOrderDetailView from "@/views/template1/rightnowactivity-order/RightNowActivityOrderDetailView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <RightNowActivityOrderDetailView lng={lng} />;
}
