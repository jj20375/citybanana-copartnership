import Image from "next/image";
import IndexView from "@/views/template1/index/IndexView";

import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <IndexView lng={lng} />;
}
