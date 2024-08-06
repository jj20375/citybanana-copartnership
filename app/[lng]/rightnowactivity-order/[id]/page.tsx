import Image from "next/image";
import RightNowActivityOrderDetailView from "@/views/template1/rightnowactivity-order/RightNowActivityOrderDetailView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, id } }: { params: { lng: string; id: string[] } }) {
    return <RightNowActivityOrderDetailView lng={lng} />;
}
