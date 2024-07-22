"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import useWidowResizeStore from "@/store-zustand//widowResizeStore";
const Context = createContext<{
    size: { width: null | number; height: number | null };
    device: { isMobile: boolean; isPadTab: boolean };
}>({
    size: { width: 0, height: 0 },
    device: {
        isMobile: false,
        isPadTab: false,
    },
});

// 監控目前視窗大小
function handleResize({ width }: { width: number | null }): { isMobile: boolean; isPadTab: boolean } {
    let isMobile = false;
    let isPadTab = false;
    // 判斷螢幕尺寸小於 600 就代表為手機
    if (width && width > 600) {
        isMobile = false;
    } else {
        isMobile = true;
    }
    // 判斷螢幕尺寸 大於 600 且小於 769 就代表為平板
    if (width && width > 600 && width < 1025) {
        isPadTab = true;
    } else {
        isPadTab = false;
    }
    return {
        isMobile,
        isPadTab,
    };
}

const Provider = ({ children }: { children: React.ReactNode }) => {
    const setIsMobile = useWidowResizeStore((state) => state.setIsMobile);
    const setIsPadTab = useWidowResizeStore((state) => state.setIsPadTab);

    const size = useWindowSize();
    const [device, setDevice] = useState({ isMobile: false, isPadTab: false });
    useEffect(() => {
        // 取得 isMobile 或 isPadTab 狀態值
        const device = handleResize({ width: size.width });
        setIsMobile(device.isMobile);
        setIsPadTab(device.isPadTab);
        setDevice(device);
    }, [size]);
    return <Context.Provider value={{ size, device }}>{children}</Context.Provider>;
};

export const WindowResizeContext = Context;

export default Provider;
