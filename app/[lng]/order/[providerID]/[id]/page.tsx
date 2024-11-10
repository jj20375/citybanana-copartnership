import Image from "next/image";
import OrderDetailView from "@/views/template1/order/OrderDetailView";

export default async function Page({ params: { lng, providerID, id } }: { params: { lng: string; providerID: string; id: string } }) {
    return (
        <OrderDetailView
            lng={lng}
            providerID={providerID}
            rightNowActivityID={id}
        />
    );
}
