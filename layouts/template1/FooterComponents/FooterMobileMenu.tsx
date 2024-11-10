"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/i18n/i18n-client";
import { tmc } from "@/service/utils";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
// 驗證規則是否符合
import { checkPattern } from "@/service/utils";
import Menu1 from "@/public/img/footer/menu-1.svg";
import Menu2 from "@/public/img/footer/menu-2.svg";
import Menu3 from "@/public/img/footer/menu-3.svg";

/**
 * 手機版底部選單
 * @param param0
 */
export default function FooterMobileMenu({ lng, rightNowActivityPath }: { lng: string; rightNowActivityPath: string }) {
    const { t } = useTranslation(lng, "main");
    const serviceChatID = process.env.NEXT_PUBLIC_SERVICE_CHAT_ID;
    const pathname = usePathname();

    const defaultMenus = [
        {
            label: t("footer.menus.menu_1"),
            img: () => <Menu1 className="mx-auto" />,
            key: "rightNowActivityPath",
            path: rightNowActivityPath,
            isActive: false,
        },
        {
            label: t("footer.menus.menu_2"),
            img: () => <Menu2 className="mx-auto" />,
            key: "chatRoomPath",
            path: "/join-providers-chatroom/" + serviceChatID,
            isActive: false,
        },
        {
            label: t("footer.menus.menu_3"),
            img: () => <Menu3 className="mx-auto" />,
            key: "rightNowActivityOrderListPath",
            path: "/rightnowactivity-order/list/starting",
            isActive: false,
        },
    ];
    // const [menus, setMenus] = useState();

    const menus = useMemo(() => {
        // 即刻快閃訂單頁面路徑
        const rightNowActivityOrderPath = "rightnowactivity-order";
        // 即刻快閃報名頁路徑
        const rightNowActivityRecruitmentOrderPath = "rightnowactivity-recruitment-order";
        // 取消即刻快閃或報名成功子路徑頁面
        const rightNowActivitySubPaths = ["success", "cancel"];
        // 即刻快閃報名後頁面選單 驗證是否為當前畫面規則
        // (?!list$) 是一个负向前瞻，表示接下来的字符不能是 list，并且后面跟着字符串的结束 $。这确保了 orderId 部分不等于 list。
        const rightNowActivityPathRegex = new RegExp(`${lng}/${rightNowActivityOrderPath}/?(${rightNowActivitySubPaths.join("|")})?(?!list$)[^\/]+$`);
        // 即刻快閃報名後中頁面選單 驗證是否為當前畫面規則
        const rightNowActivityRrecruitmentOrderPathRegex = new RegExp(`${lng}/${rightNowActivityRecruitmentOrderPath}/?`);
        // 聊天室畫面
        const chatRoomPathRegex = new RegExp(`${lng}/join-providers-chatroom/?`);
        // 訂單列表頁
        const rightNowActivityOrderListPathRegex = new RegExp(`${lng}/rightnowactivity-order/list/?`);

        if (pathname) {
            // 確認是否為即刻快閃訂單頁面
            const activeRightNowActivityOrderMenu = checkPattern(pathname, rightNowActivityPathRegex);
            // 確認是否為即刻快閃報名頁面
            const activeRightNowActivityRecruitmentMenu = checkPattern(pathname, rightNowActivityRrecruitmentOrderPathRegex);
            // 確認是否為聊天室畫面
            const activeChatRoomMenu = checkPattern(pathname, chatRoomPathRegex);
            // 確認是否為訂單列表頁面
            const activeRightNowActivityOrderListMenu = checkPattern(pathname, rightNowActivityOrderListPathRegex);
            console.log("activeRightNowActivityOrderMenu =>", activeRightNowActivityOrderMenu, activeRightNowActivityOrderListMenu, pathname);

            // 判斷是否為即刻快閃相關畫面
            if (activeRightNowActivityOrderMenu || activeRightNowActivityRecruitmentMenu) {
                return defaultMenus.map((menu) => {
                    return {
                        ...menu,
                        isActive: menu.key === "rightNowActivityPath",
                    };
                });
            }
            // 判斷是否為聊天室畫面
            if (activeChatRoomMenu) {
                return defaultMenus.map((menu) => {
                    return {
                        ...menu,
                        isActive: menu.key === "chatRoomPath",
                    };
                });
            }
            // 判斷是否為訂單列表畫面
            if (activeRightNowActivityOrderListMenu) {
                return defaultMenus.map((menu) => {
                    return {
                        ...menu,
                        isActive: menu.key === "rightNowActivityOrderListPath",
                    };
                });
            }
        }
        console.log("defaultMenus =>", defaultMenus);
        return defaultMenus;
    }, [pathname]);
    return (
        <div className="md:static fixed bottom-0 mx-auto flex items-center mt-10 justify-center w-full bg-white">
            <ul className="flex flex-1 mx-auto min-h-[80px] items-center max-w-[500px] border-t border-gray-light justify-center">
                {menus.map((menu) => (
                    <li
                        key={menu.path}
                        className="flex-1"
                    >
                        <Link
                            href={menu.path}
                            className="text-center flex justify-center"
                        >
                            <div>
                                <div className={tmc(["w-[80px] h-[30px] mx-auto", menu.isActive ? "text-primary" : "text-gray-primary"])}>{menu.img()}</div>
                                <div className={tmc(["text-sm-content", menu.isActive ? "text-primary" : "text-gray-primary"])}>{menu.label}</div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
