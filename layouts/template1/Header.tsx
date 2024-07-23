import { GetFooterDatasAPI } from "@/api/utilsAPI";
import HeaderMenu from "./HeaderComponents/Menu/HeaderMenu";

export default async function Page() {
    const menus: never[] = [];
    return (
        <>
            <header className="flex items-center">
                <HeaderMenu menus={menus} />
            </header>
        </>
    );
}
