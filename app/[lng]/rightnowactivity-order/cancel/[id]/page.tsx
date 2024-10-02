import Image from "next/image";
import RightNowActivityOrderCancelView from "@/views/template1/rightnowactivity-order/RightNowActivityOrderCancelView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, id } }: { params: { lng: string; id: string } }) {
    return (
        <RightNowActivityOrderCancelView
            lng={lng}
            orderID={id}
        />
    );
}
