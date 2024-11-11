import { HeaderContent } from "@/layouts/template1/Header";
export default function Layout({ children, params: { lng } }: { children: React.ReactNode; params: { lng: string } }) {
    return (
        <>
            <HeaderContent lng={lng} />
            <div>{children}</div>
        </>
    );
}
