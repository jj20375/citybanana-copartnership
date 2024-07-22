"use client";
import { useState } from "react";
import useWidowResizeStore from "@/store-zustand/widowResizeStore";
import HeaderDesktopSearchBtn from "./HeaderDesktopSearchBtn";
import HeaderMobileSearchBtn from "./HeaderMobileSearchBtn";

export default function HeaderSearchBtn() {
    const isMobile = useWidowResizeStore((state) => state.isMobile);
    const [showSearchBar, setShowSearchBar] = useState(false);
    if (isMobile) {
        return (
            <HeaderMobileSearchBtn
                showSearchBar={showSearchBar}
                setShowSearchBar={setShowSearchBar}
            />
        );
    }
    return (
        <HeaderDesktopSearchBtn
            showSearchBar={showSearchBar}
            setShowSearchBar={setShowSearchBar}
        />
    );
}
