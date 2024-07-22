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
    // let [menus2, setMenus2] = useState([]);
    // const getMenuDatas = useCallback(async () => {
    //     try {
    //         const data = await GetFooterDatasAPI();
    //         return data;
    //     } catch (err) {
    //         console.error("getMenuDatas err =>", err);
    //     }
    // }, []);

    // useEffect(() => {
    //     getMenuDatas().then((datas) => {
    //         const menus = datas.map((menu: { title: string; child: any[] }, index: number) => {
    //             const obj: {
    //                 key: number;
    //                 label: string;
    //                 child: any[];
    //             } = {
    //                 key: index,
    //                 label: menu.title,
    //                 child: [],
    //             };
    //             let childMenu: { key: number; label: any }[] = [];
    //             if (menu.child.length > 0) {
    //                 childMenu = menu.child.map((child: { link: string; label: string }, childIndex: number) => {
    //                     const obj = {
    //                         key: childIndex,
    //                         label: (
    //                             <a
    //                                 href={child.link}
    //                                 target="_blank"
    //                             >
    //                                 {child.label}
    //                             </a>
    //                         ),
    //                     };
    //                     return obj;
    //                 });
    //             }
    //             obj.child = childMenu;
    //             return obj;
    //         });
    //         setMenus2(menus);
    //     });
    // }, [getMenuDatas]);
    // function work() {
    //     return new Promise<any>(async (resolve, reject) => {
    //         const datas = await getMenuDatas();
    //         resolve(datas);
    //     });
    // }

    // 選單組件
    const ListItems = menus.map((menu: any) => {
        return (
            <li
                key={menu.key}
                className="mr-2"
            >
                <Dropdown
                    menu={{ items: menu.child }}
                    trigger={["click"]}
                >
                    <Space className="flex items-center">
                        <div className="cursor-pointer flex items-center">
                            {menu.label}
                            <Icon
                                icon="iconamoon:arrow-down-2"
                                className="text-xl"
                            />
                        </div>
                    </Space>
                </Dropdown>
            </li>
        );
    });

    return (
        <>
            <menu className="">
                <ul className="flex items-center text-gray-400">
                    <li className="cursor-pointer mr-2">
                        <Image
                            src="/img/logos/logo_type3.svg"
                            alt="logo"
                            width={200}
                            height={150}
                        />
                    </li>
                    {ListItems}
                    <SubscriptionComponent />
                </ul>
            </menu>
        </>
    );
}
