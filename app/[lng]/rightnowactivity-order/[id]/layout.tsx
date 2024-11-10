import FooterMenu from "@/layouts/template1/FooterComponents/FooterMenu";
import { HeaderContent } from "@/layouts/template1/Header";
export default function Layout({ children, params: { lng, id } }: { children: React.ReactNode; params: { lng: string; id?: string | void } }) {
    const rightNowActivityPath = id ? `/rightnowactivity-recruitment-order/${id}` : "/rightnowactivity-order/list/all";
    return (
        <>
            <HeaderContent lng={lng} />
            <div>{children}</div>
            <FooterMenu
                lng={lng}
                rightNowActivityPath={rightNowActivityPath}
            />
        </>
    );
}
