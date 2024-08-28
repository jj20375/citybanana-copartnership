import Image from "next/image";
import IndexView from "@/views/template1/index/IndexView";

import { useTranslation } from "@/i18n";
import { HeaderIndex } from "@/layouts/template1/Header";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return (
        <>
            <HeaderIndex lng={lng} />
            <IndexView lng={lng} />;
        </>
    );
}
