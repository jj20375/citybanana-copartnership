"use client";
import useSWR from "swr";
import { GetIndexAPI2 } from "@/api/userAPI";
import { Button } from "antd";
import useWidowResizeStore from "@/store-zustand/widowResizeStore";
import { useTranslation } from "@/i18n/i18n-client";
export default function Page({ params: { lng, slug } }: { params: { lng: string; slug: string } }) {
    console.log("rerender work5");
    const { t } = useTranslation(lng, "main");

    const isMobile = useWidowResizeStore((state) => state.isMobile);
    const isPadTab = useWidowResizeStore((state) => state.isPadTab);

    const fetcher = async () => {
        return await GetIndexAPI2();
    };

    const { data: fetchData, error, isLoading }: any = useSWR("GetIndexAPI2", fetcher, {});

    if (error) {
        return (
            <>
                <div>{JSON.stringify(error, null, 4)}</div>
            </>
        );
    }
    if (isLoading) {
        return (
            <>
                <div>isLOading...</div>
            </>
        );
    }

    return (
        <>
            <Button type="primary">Button</Button>

            <div>test{t("title")}</div>
            <div>isMobile: {JSON.stringify(isMobile)}</div>
            <div>isPadTab: {JSON.stringify(isPadTab)}</div>
            {/* <div>{JSON.stringify(size, null, 4)}</div> */}
            {/* <div>{JSON.stringify(fetchData, null, 4)}</div> */}
        </>
    );
}
