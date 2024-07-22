"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { Drawer } from "antd";
import Image from "next/image";
import type { DrawerClassNames, DrawerStyles } from "antd/es/drawer/DrawerPanel";

export default function HeaderMobileMenu({ menus, SubscriptionComponent }: any) {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const drawerStyles: DrawerStyles = {
        header: {
            borderBottom: `0 solid`,
        },
    };

    const ListItems = menus.map((menu: any) => {
        return (
            <div
                className="mt-5"
                key={menu.title}
            >
                <h3 className="text-lg text-black font-bold">{menu.title}</h3>
                <ul className="mt-5 text-sm text-gray-400">
                    {menu.child.map((child: any) => {
                        return (
                            <li
                                className="mb-2"
                                key={child.label}
                            >
                                <a href={child.link}>{child.label}</a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    });

    return (
        <>
            <button onClick={showDrawer}>
                <Icon icon="fa6-solid:bars" />
            </button>

            <Drawer
                title={
                    <Image
                        src="/img/logos/logo_type3.svg"
                        alt="logo"
                        width={200}
                        height={150}
                        className="w-[120px] md:w-[200px]"
                    />
                }
                onClose={onClose}
                open={open}
                width={"80%"}
                key="showDrawer"
                placement="left"
                closable={false}
                styles={drawerStyles}
                extra={
                    <div className="flex justify-start">
                        <div className="flex-1"></div>
                        <button onClick={onClose}>
                            <Icon
                                className="bg-white text-black"
                                icon="ep:close-bold"
                            />
                        </button>
                    </div>
                }
            >
                {ListItems}
                <SubscriptionComponent />
            </Drawer>
        </>
    );
}
