"use client";
import useWidowResizeStore from "@/store-zustand/widowResizeStore";
import FooterMobileMenu from "./FooterMobileMenu";

/**
 * footer 選單
 * @param param0
 */
export default function FooterMenu({ lng, rightNowActivityPath }: { lng: string; rightNowActivityPath: string }) {
    const isMobile = useWidowResizeStore((state) => state.isMobile);
    if (isMobile) {
        return (
            <FooterMobileMenu
                lng={lng}
                rightNowActivityPath={rightNowActivityPath}
            />
        );
    }
    return (
        <FooterMobileMenu
            lng={lng}
            rightNowActivityPath={rightNowActivityPath}
        />
    );
}
