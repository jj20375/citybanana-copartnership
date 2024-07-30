import Image from "next/image";
import CreateRightNowActivityOrderView from "@/views/template1/create-rightnowactivity-order/CreateRightNowActivityOrderView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <CreateRightNowActivityOrderView lng={lng} />;
}
