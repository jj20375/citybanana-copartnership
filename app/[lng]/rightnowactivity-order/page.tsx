import Image from "next/image";
import RightNowActivityOrderListView from "@/views/template1/rightnowactivity-order-list/RightNowActivityOrderListView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <RightNowActivityOrderListView lng={lng} />;
}
