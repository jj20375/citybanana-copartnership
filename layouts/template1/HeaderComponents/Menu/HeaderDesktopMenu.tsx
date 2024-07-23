"use client";
import Image from "next/image";
import { GetFooterDatasAPI } from "@/api/utilsAPI";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function HeaderDesktopMenu({ menus, SubscriptionComponent }: any) {
    menus = menus.map((menu: { title: string; child: any[] }, index: number) => {
        const obj: {
            key: number;
            label: string;
            child: any[];
        } = {
            key: index,
            label: menu.title,
            child: [],
        };
        let childMenu: { key: number; label: any }[] = [];
        if (menu.child.length > 0) {
            childMenu = menu.child.map((child: { link: string; label: string }, childIndex: number) => {
                const obj = {
                    key: childIndex,
                    label: (
                        <a
                            href={child.link}
                            target="_blank"
                        >
                            {child.label}
                        </a>
                    ),
                };
                return obj;
            });
        }
        obj.child = childMenu;
        return obj;
    });

    return (
        <>
            <menu className="w-full">
                <ul className="flex items-center text-gray-400 justify-center">
                    <li className="cursor-pointer mr-2">
                        <Image
                            src="/img/logos/logo_type3.svg"
                            alt="logo"
                            width={200}
                            height={150}
                        />
                    </li>
                </ul>
            </menu>
        </>
    );
}
