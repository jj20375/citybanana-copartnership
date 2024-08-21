import Image from "next/image";
import OrderCreateSuccessView from "@/views/template1/order/OrderCreateSuccessView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <OrderCreateSuccessView lng={lng} />;
}
