import { HeaderContent } from "@/layouts/template1/Header";
import FooterMenu from "@/layouts/template1/FooterComponents/FooterMenu";
export default function Layout({ children, params: { lng, id } }: { children: React.ReactNode; params: { lng: string; id: string } }) {
    return (
        <>
            <HeaderContent lng={lng} />
            <div>{children}</div>
            <FooterMenu
                lng={lng}
                rightNowActivityPath={`/rightnowactivity-order/${id}`}
            />
        </>
    );
}
