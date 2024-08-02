import Image from "next/image";
import RightNowActivityOrderPaymentView from "@/views/template1/rightnowactivity-order-payment/RightNowActivityOrderPaymentView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, id } }: { params: { lng: string; id: string[] } }) {
    return <RightNowActivityOrderPaymentView lng={lng} />;
}
