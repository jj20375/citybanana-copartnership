"use client";
import HeaderDesktopMenu from "@/layouts/template1/HeaderComponents/Menu/HeaderDesktopMenu";
import HeaderMobileMenu from "@/layouts/template1/HeaderComponents/Menu/HeaderMobileMenu";
import useWidowResizeStore from "@/store-zustand/widowResizeStore";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { WindowResizeContext } from "@/context/windowResizeContext";

// 追蹤我們選單組件
const SubscriptionComponent = dynamic(() => import("@/layouts/template1/HeaderComponents/Menu/HeaderSubscriptionMenu"));

export default function HeaderMenu({ menus }: any) {
    // const { device } = useContext(WindowResizeContext);
    const isMobile = useWidowResizeStore((state) => state.isMobile);
    if (isMobile) {
        return <HeaderMobileMenu menus={menus} />;
    }
    return <HeaderDesktopMenu menus={menus} />;
}
