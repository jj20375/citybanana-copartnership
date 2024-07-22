import { GetFooterDatasAPI } from "@/api/utilsAPI";
import HeaderMenu from "./HeaderComponents/Menu/HeaderMenu";
import HeaderSearchBtn from "./HeaderComponents/SearchBtn/SearchBtn";
import HeaderLoginBtn from "./HeaderComponents/Login/HeaderLoginBtn";

async function getMenuDatas() {
    try {
        const data = await GetFooterDatasAPI();
        return data;
    } catch (err) {
        console.error("getMenuDatas err =>", err);
    }
}

export default async function Page() {
    const menus = await getMenuDatas();
    return (
        <>
            <header className="flex items-center">
                <HeaderMenu menus={menus} />
                <HeaderSearchBtn />
                <HeaderLoginBtn />
            </header>
        </>
    );
}
