import { HeaderContent } from "@/layouts/template1/Header";
export default function Layout({ children, lng }: { children: React.ReactNode; lng: string }) {
    return (
        <>
            <HeaderContent lng={lng} />
            <div>{children}</div>
        </>
    );
}
