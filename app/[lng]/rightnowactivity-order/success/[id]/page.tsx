import Image from "next/image";
import RightNowActivityOrderCreateSuccessView from "@/views/template1/rightnowactivity-order/RightNowActivityOrderCreateSuccessView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, orderID } }: { params: { lng: string; orderID: string } }) {
    return (
        <RightNowActivityOrderCreateSuccessView
            lng={lng}
            orderID={orderID}
        />
    );
}
