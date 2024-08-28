import { GetFooterDatasAPI } from "@/api/utilsAPI";
import { HeaderIndexMenu, HeaderContentMenu } from "./HeaderComponents/Menu/HeaderMenu";

export async function HeaderIndex({ lng }: { lng: string }) {
    const menus: never[] = [];
    return (
        <>
            <header className="flex items-center">
                <HeaderIndexMenu menus={menus} />
            </header>
        </>
    );
}
export async function HeaderContent({ lng }: { lng: string }) {
    const menus: never[] = [];
    return (
        <>
            <header className="flex items-center">
                <HeaderContentMenu menus={menus} />
            </header>
        </>
    );
}
