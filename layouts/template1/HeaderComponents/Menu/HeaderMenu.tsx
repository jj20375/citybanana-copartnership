"use client";
import { HeaderDesktopIndexMenu, HeaderDesktopContentMenu } from "@/layouts/template1/HeaderComponents/Menu/HeaderDesktopMenu";
import { HeaderMobileIndexMenu, HeaderMobileContentMenu } from "@/layouts/template1/HeaderComponents/Menu/HeaderMobileMenu";
import useWidowResizeStore from "@/store-zustand/widowResizeStore";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { WindowResizeContext } from "@/context/windowResizeContext";

// 追蹤我們選單組件
const SubscriptionComponent = dynamic(() => import("@/layouts/template1/HeaderComponents/Menu/HeaderSubscriptionMenu"));

export function HeaderIndexMenu({ menus }: any) {
    // const { device } = useContext(WindowResizeContext);
    const isMobile = useWidowResizeStore((state) => state.isMobile);
    if (isMobile) {
        return <HeaderMobileIndexMenu menus={menus} />;
    }
    return <HeaderDesktopIndexMenu menus={menus} />;
}
export function HeaderContentMenu({ menus }: any) {
    // const { device } = useContext(WindowResizeContext);
    const isMobile = useWidowResizeStore((state) => state.isMobile);
    if (isMobile) {
        return <HeaderMobileContentMenu menus={menus} />;
    }
    return <HeaderDesktopContentMenu menus={menus} />;
}
