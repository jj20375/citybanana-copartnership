import { useTranslation } from "@/i18n";
import Link from "next/link";
import { getPartnerStoreInfoAPI, type GetPartnerStoreInfoAPIInterface } from "@/api/partnerStoreAPI";
import { useSearchParams } from "next/navigation";
export default async function IndexView({ lng, merchantCode, venueID }: { lng: string; merchantCode: string; venueID?: void | string }) {
    const { t } = await useTranslation(lng, "main");

    let partnerStoreData: GetPartnerStoreInfoAPIInterface | object = {};
    async function getPartnerStoreInfo() {
        try {
            partnerStoreData = await getPartnerStoreInfoAPI({ storeCode: merchantCode, venueID });
            console.log("getPartnerStoreInfoAPI Data =>", partnerStoreData);
        } catch (error) {
            console.log("merchantCode =>", merchantCode);
            console.error("getPartnerStoreInfoAPI error =>", error);
        }
    }
    await getPartnerStoreInfo();
    return (
        <div className="text-white mx-auto max-w-[400px] text-center flex flex-col justify-end h-screen bg-gradient-to-t from-black to-white">
            <pre className="text-black my-10">{JSON.stringify(partnerStoreData, null, 4)}</pre>
            <h1 className="text-lg-title">{t("index.title")}</h1>
            <h2 className="text-lg-title">{t("index.second-title")}</h2>
            <Link
                href="/create-rightnowactivity-order"
                className="mx-auto"
            >
                <button className="rounded-md PrimaryGradient h-[45px] w-[271px] flex items-center justify-center mt-[40px] mb-[64px]">{t("index.start")}</button>
            </Link>
        </div>
    );
}
