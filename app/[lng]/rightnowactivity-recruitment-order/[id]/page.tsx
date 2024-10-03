import Image from "next/image";
import RightNowActivityRecruitmentOrderDetailView from "@/views/template1/rightnowactivity-recruitment-order/RightNowActivityRecruitmentOrderDetailView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, id } }: { params: { lng: string; id: string } }) {
    return (
        <RightNowActivityRecruitmentOrderDetailView
            lng={lng}
            orderID={id}
        />
    );
}
