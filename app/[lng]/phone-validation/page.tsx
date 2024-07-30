import Image from "next/image";
import PhoneValidationView from "@/views/template1/phone-validation/PhoneValidationView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <PhoneValidationView lng={lng} />;
}
