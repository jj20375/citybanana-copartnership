import Image from "next/image";
import OrderCancelDetailView from "@/views/template1/order/OrderCancelDetailView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, orderID } }: { params: { lng: string; orderID: string } }) {
    return (
        <OrderCancelDetailView
            lng={lng}
            orderID={orderID}
        />
    );
}
