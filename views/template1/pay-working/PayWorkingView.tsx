"use server";
import { useTranslation } from "@/i18n";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PayWorkingView({ lng, orderID }: { lng: string; orderID: string }) {
    const { t } = await useTranslation(lng, "main");

    async function sleep() {
        await new Promise((resolve: Function) => setTimeout(resolve("sleep done"), 2000));
    }

    // 下一步按鈕事件
    const onNextStepButtonClick = () => {};
    await sleep();
    redirect(`/rightnowactivity-order/success/${orderID}`);

    return (
        <div className="mt-[55px] mx-auto max-w-[400px] text-center">
            <Image
                src="/img/icons/pay-loader.svg"
                width={100}
                height={100}
                style={{ width: "76px", height: "auto" }}
                className="mx-auto"
                alt="pay-loader"
            />
            <h1 className="text-md-title text-gray-primary mt-[30px] font-semibold">{t("payWorking.title")}...</h1>
            <p className="text-[#7c7c7c] text-[20px] mt-[30px] whitespace-pre-wrap">{t("payWorking.description")}</p>
            <Link
                href={{
                    pathname: "/rightnowactivity-order/success/1",
                }}
            >
                測試下一步
            </Link>
        </div>
    );
}
