import Image from "next/image";
import RightNowActivityOrderListView from "@/views/template1/rightnowactivity-order-list/RightNowActivityOrderListView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, status } }: { params: { lng: string; status: string } }) {
    return (
        <RightNowActivityOrderListView
            lng={lng}
            status={status}
        />
    );
}
