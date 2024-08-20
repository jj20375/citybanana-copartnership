import Image from "next/image";
import OrderDetailView from "@/views/template1/order/OrderDetailView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <OrderDetailView lng={lng} />;
}
