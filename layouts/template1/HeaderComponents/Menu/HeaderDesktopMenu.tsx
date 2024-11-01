"use client";
import Image from "next/image";
import { GetFooterDatasAPI } from "@/api/utilsAPI";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

export function HeaderDesktopContentMenu({ menus, SubscriptionComponent }: any) {
    return (
        <>
            <menu className="w-full">
                <ul className="flex items-center text-gray-400 justify-center">
                    <li className="cursor-pointer mr-2">
                        <Link href={{ pathname: "/zh-TW" }}>
                            <Image
                                src="/img/logos/logo_type3.svg"
                                alt="logo"
                                width={200}
                                height={150}
                                style={{ width: "200px", height: "auto" }}
                            />
                        </Link>
                    </li>
                </ul>
            </menu>
        </>
    );
}
export function HeaderDesktopIndexMenu({ menus, SubscriptionComponent }: any) {
    return (
        <>
            <menu className="w-full">
                <ul className="flex items-center text-gray-400 justify-center">
                    <li className="cursor-pointer mr-2">
                        <Link href={{ pathname: "/zh-TW" }}>
                            <Image
                                src="/img/logos/logo_type3.svg"
                                alt="logo"
                                width={200}
                                height={150}
                                style={{ width: "200px", height: "auto" }}
                            />
                        </Link>
                    </li>
                </ul>
            </menu>
        </>
    );
}
