"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { Drawer } from "antd";
import Image from "next/image";
import type { DrawerClassNames, DrawerStyles } from "antd/es/drawer/DrawerPanel";

export default function HeaderMobileMenu({ menus, SubscriptionComponent }: any) {
    const menu = (
        <menu className="mt-5 w-full flex justify-center">
            <ul className="mt-5 text-sm text-gray-400">
                <li>
                    <Image
                        src="/img/logos/logo_type3.svg"
                        alt="logo"
                        width={200}
                        height={150}
                        className="w-[120px] md:w-[200px]"
                    />
                </li>
            </ul>
        </menu>
    );

    return <>{menu}</>;
}
