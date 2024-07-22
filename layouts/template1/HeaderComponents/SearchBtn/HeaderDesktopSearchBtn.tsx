"use client";
import { Icon } from "@iconify/react";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { sendGAEvent } from "@next/third-parties/google";
import { memo } from "react";

const HeaderDesktopSearchBtn = memo(({ showSearchBar, setShowSearchBar }: { showSearchBar: boolean; setShowSearchBar: Function }) => {
    const isProvider = useAppSelector((state) => state.userStore.isProvider);
    const isVisitor = useAppSelector((state) => state.userStore.isVisitor);
    function onShow() {
        setShowSearchBar(!showSearchBar);
        sendGAEvent({ event: "首頁點擊搜尋", value: "test 首頁點擊搜尋" });
        console.log("gaDataLayer => ", window.gaDataLayer);
    }

    function SearchBtn() {
        return (
            <div
                className="cursor-pointer"
                onClick={onShow}
            >
                <div className="flex items-center p-2 mr-2 text-black border rounded-full">
                    <Icon
                        className="text-2xl"
                        icon="mingcute:search-2-fill"
                    />
                    <span className="text-sm text-gray-200">搜尋服務商/城市/日期</span>
                </div>
            </div>
        );
    }
    return <>{!isProvider || isVisitor ? <SearchBtn /> : null}</>;
});

export default HeaderDesktopSearchBtn;
