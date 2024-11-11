import Image from "next/image";
import SmsOrderErrorView from "@/views/template1/sms-order/SmsOrderErrorView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, id } }: { params: { lng: string; id: string } }) {
    return (
        <SmsOrderErrorView
            lng={lng}
            orderID={id}
        />
    );
}
