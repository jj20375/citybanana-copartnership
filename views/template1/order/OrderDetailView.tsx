"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import OrderDetail from "../components/OrderDetail";
import { Icon } from "@iconify/react";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "@/views/template1/rightnowactivity-order/rightnowactivity-order-interface";
/**
 * 訂單詳細資料
 * @param param0
 * @returns
 */
export default function OrderDetailView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();

    const backList = () => {
        router.push("/");
    };

    const [provider, setProvider] = useState<RightNowActivityOrderDetailProviderSigupCardInterface>({
        id: `provider-${0}`,
        name: "test1-" + "0",
        cover: `https://picsum.photos/id/11/300/300`,
        rate: 4.5,
        description:
            "Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还通过了电子排版的挑战，其雏形却依然保存至今。在1960年代，”Leatraset”公司发布了印刷着Lorem Ipsum段落的纸张，从而广泛普及了它的使用。最近，计算机桌面出版软件”Aldus PageMaker”也通过同样的方式使Lorem Ipsum落入大众的视野。",
        unit: "hour",
        height: 160,
        weight: 70,
        age: 35,
        travelTime: 35,
        isNowTime: true,
        price: 2000,
        area: "TW-TPE",
        job: "金融業",
        authentication: true,
        isQueen: true,
    });

    const RenderTitle = () => (
        <div className="flex items-center mb-[40px] font-bold">
            <Icon
                className="text-3xl cursor-pointer text-black"
                icon="iconamoon:arrow-left-2-light"
                onClick={backList}
            />
            <h1 className="text-black w-full text-md-title text-center">{t("orderDetail.title")}</h1>
        </div>
    );

    useEffect(() => {
        setProvider({
            id: `provider-${0}`,
            name: "test1-" + "0",
            cover: `https://picsum.photos/id/11/300/300`,
            rate: 4.5,
            description:
                "Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还通过了电子排版的挑战，其雏形却依然保存至今。在1960年代，”Leatraset”公司发布了印刷着Lorem Ipsum段落的纸张，从而广泛普及了它的使用。最近，计算机桌面出版软件”Aldus PageMaker”也通过同样的方式使Lorem Ipsum落入大众的视野。",
            unit: "hour",
            height: 160,
            weight: 70,
            age: 35,
            travelTime: 35,
            isNowTime: true,
            price: 2000,
            area: "TW-TPE",
            job: "金融業",
            authentication: true,
            isQueen: true,
        });
    }, []);
    return (
        <div className="mx-auto max-w-[400px] mt-[40px]">
            <OrderDetail
                lng={lng}
                renderTitle={RenderTitle()}
                providerData={provider}
            />
        </div>
    );
}
