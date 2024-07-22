"use client";
import Image from "next/image";
import { Dropdown, Space } from "antd";
import useWidowResizeStore from "@/store-zustand/widowResizeStore";
import { isAndroidDevice } from "@/service/utils";
import { Icon } from "@iconify/react";

// 追蹤我們組件
function SubscriptionComponent() {
    const isMobile = useWidowResizeStore((state) => state.isMobile);

    const subscription = {
        label: "追蹤我們",
        child: [
            {
                key: "contact-fb",
                label: (
                    <a
                        target="contact-fb"
                        href={isMobile ? (!isAndroidDevice ? "fb://profile/106949181910192" : "fb://page/106949181910192") : "https://www.facebook.com/CityBanana"}
                    >
                        <Image
                            src="/img/contact-fb.svg"
                            alt="contact-fb"
                            width={200}
                            height={200}
                        />
                    </a>
                ),
            },
            {
                key: "contact-ig",
                label: (
                    <a
                        target="contact-ig"
                        href="https://www.instagram.com/citybananatw"
                    >
                        <Image
                            src="/img/contact-ig.svg"
                            alt="contact-ig"
                            width={200}
                            height={200}
                        />
                    </a>
                ),
            },
        ],
    };
    if (isMobile) {
        subscription.child.push({
            key: "iosAppDownload",
            label: (
                <a
                    target="iosAppDownload_member"
                    href="https://apps.apple.com/tw/app/citybanana/id6443787128"
                >
                    <Image
                        src="/img/iosAppDownload_member.svg"
                        alt="iosAppDownload"
                        width={200}
                        height={200}
                    />
                </a>
            ),
        });
    }
    function MobileItems() {
        return (
            <div
                className="mt-5"
                key={subscription.label}
            >
                <h3 className="text-lg text-black font-bold">{subscription.label}</h3>
                <ul className="mt-5 text-sm text-gray-400">
                    {subscription.child.map((child: any) => {
                        return (
                            <li
                                className="mb-2"
                                key={child.key}
                            >
                                {child.label}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
    function DesktopItems() {
        return (
            <li>
                <Dropdown
                    menu={{ items: subscription.child }}
                    trigger={["click"]}
                >
                    <Space className="flex items-center">
                        <div className="cursor-pointer flex items-center">
                            {subscription.label}
                            <Icon
                                icon="iconamoon:arrow-down-2"
                                className="text-xl"
                            />
                        </div>
                    </Space>
                </Dropdown>
            </li>
        );
    }
    return <>{isMobile ? <MobileItems /> : <DesktopItems />}</>;
}

export default SubscriptionComponent;
