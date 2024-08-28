"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { Drawer } from "antd";
import Image from "next/image";
import type { DrawerClassNames, DrawerStyles } from "antd/es/drawer/DrawerPanel";

export function HeaderMobileContentMenu({ menus, SubscriptionComponent }: any) {
    const menu = (
        <menu className="mt-5 w-full flex justify-center">
            <ul className="mt-5 text-sm text-gray-400">
                <li>
                    <Image
                        src="/img/logos/logo_type3.svg"
                        alt="logo"
                        width={200}
                        height={150}
                        className="w-[120px]"
                        style={{ width: "120px", height: "auto" }}
                    />
                </li>
            </ul>
        </menu>
    );

    return <>{menu}</>;
}
export function HeaderMobileIndexMenu({ menus, SubscriptionComponent }: any) {
    const menu = (
        <menu className="mt-5 w-full flex justify-center">
            <ul className="mt-5 text-sm text-gray-400">
                <li>
                    <Image
                        src="/img/logos/logo_type3.svg"
                        alt="logo"
                        width={200}
                        height={150}
                        className="w-[200px]"
                        style={{ width: "200px", height: "auto" }}
                    />
                </li>
            </ul>
        </menu>
    );

    return <>{menu}</>;
}
