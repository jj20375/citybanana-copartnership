import Image from "next/image";
import OrderCancelDetailView from "@/views/template1/order/OrderCancelDetailView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, providerID, id } }: { params: { lng: string; providerID: string; id: string } }) {
    return (
        <OrderCancelDetailView
            lng={lng}
            providerID={providerID}
            rightNowActivityID={id}
        />
    );
}
