import Image from "next/image";
import OrderCreateCancelView from "@/views/template1/order/OrderCancelView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <OrderCreateCancelView lng={lng} />;
}
