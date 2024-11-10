"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/i18n/i18n-client";
import { tmc } from "@/service/utils";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
// 驗證規則是否符合
import { checkPattern } from "@/service/utils";

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
            img: "/img/footer/menu-1.svg",
            path: rightNowActivityPath,
            isActive: false,
        },
        {
            label: t("footer.menus.menu_2"),
            img: "/img/footer/menu-2.svg",
            path: "/join-providers-chatroom/" + serviceChatID,
            isActive: false,
        },
        {
            label: t("footer.menus.menu_3"),
            img: "/img/footer/menu-3.svg",
            path: "/rightnowactivity-order/list/starting",
            isActive: false,
        },
    ];
    // const [menus, setMenus] = useState();

    const menus = useMemo(() => {
        const rightNowActivityPath = "rightnowactivity-order";
        const rightNowActivityRecruitmentOrderPath = "rightnowactivity-recruitment-order";
        const rightNowActivitySubPaths = ["success", "cancel"];
        // 即刻快閃報名後頁面選單 驗證規則
        const rightNowActivityPathRegex = new RegExp(`${lng}/${rightNowActivityPath}/?(${rightNowActivitySubPaths.join("|")})?`);
        // 即刻快閃報名後中頁面選單 驗證規則
        const rightNowActivityRrecruitmentOrderPathRegex = new RegExp(`${lng}/${rightNowActivityRecruitmentOrderPath}/?`);
        if (pathname) {
            const activeRightNowActivityMenu = checkPattern(pathname, rightNowActivityPathRegex);
            const activeRightNowActivityRecruitmentMenu = checkPattern(pathname, rightNowActivityRrecruitmentOrderPathRegex);
            console.log("activeRightNowActivityMenu =>", activeRightNowActivityMenu);
            console.log("activeRightNowActivityRecruitmentMenu =>", activeRightNowActivityRecruitmentMenu);
        }
        return defaultMenus;
    }, [pathname]);
    return (
        <div className="max-w-[500px] mx-auto border-t border-gray-light min-h-[80px] flex items-center mt-10">
            <ul className="flex flex-1">
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
                                <div className="w-[80px] h-[30px]">
                                    <Image
                                        width={100}
                                        height={100}
                                        src={menu.img}
                                        alt={menu.label}
                                        className="mx-auto"
                                        style={{ width: "30px", height: "30px" }}
                                    />
                                </div>
                                <div className={tmc([menu.isActive ? "text-primary" : "text-gray-primary", "text-sm-content"])}>{menu.label}</div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
