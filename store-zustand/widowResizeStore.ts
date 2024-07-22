import { create } from "zustand";
export interface WindowResizeStoreInterface {
    isMobile: boolean;
    isPadTab: boolean;
    setIsMobile: (isMobile: boolean) => void;
    setIsPadTab: (isPadTab: boolean) => void;
}

const useWidowResizeStore = create<WindowResizeStoreInterface>((set) => ({
    isMobile: false,
    isPadTab: false,
    setIsMobile: (isMobile) => set((state) => ({ isMobile: isMobile })),
    setIsPadTab: (isPadTab) => set((state) => ({ isPadTab: isPadTab })),
}));

export default useWidowResizeStore;
