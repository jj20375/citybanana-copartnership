import Image from "next/image";
import PayWorkingView from "@/views/template1/pay-working/PayWorkingView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, orderID } }: { params: { lng: string; orderID: string } }) {
    return (
        <PayWorkingView
            lng={lng}
            orderID={orderID}
        />
    );
}
