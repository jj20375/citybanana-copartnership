"use client";
import { memo } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import type { RightNowActivityOrderDetailProviderSigupCardInterface } from "@/views/template1/rightnowactivity-recruitment-order/rightnowactivity-order-interface";
import Image from "next/image";
import { tmc } from "@/service/utils";
import { useRouter } from "next/navigation";
import { GetRightNowActivityOrderDetailAPIResInterface } from "@/api/rightNowActivityOrderAPI/rightNowActivityOrderAPI-interface";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { userBananaIdSelector } from "@/store-toolkit/stores/userStore";
import { SetReceiverChatRoomAPI } from "@/api/chatAPI/chatAPI";
import { SetReceiverChatRoomAPIReqInterface } from "@/api/chatAPI/chatAPI-interface";
/**
 * 訂單上方服務商資料區塊 ui
 */
const OrderByProviderContent = memo(({ lng, providerData, orderData, customClass }: { lng: string; providerData: RightNowActivityOrderDetailProviderSigupCardInterface; orderData: GetRightNowActivityOrderDetailAPIResInterface; customClass?: string | void }) => {
    const { t } = useTranslation(lng, "main");
    const router = useRouter();
    const userStore = useAppSelector((state) => state.userStore);
    const userID = userBananaIdSelector(userStore);
    /**
     * 設定聊天對象資料
     * @param data
     */
    const setReceiverChatRoom = async (data: SetReceiverChatRoomAPIReqInterface) => {
        try {
            const res = await SetReceiverChatRoomAPI(data);
            console.log("SetReceiverChatRoomAPI =>", res);
        } catch (err) {
            console.log("SetReceiverChatRoomAPI err =>", err);
            throw err;
        }
    };

    const goToChatroom = async (receiverID: string) => {
        // 設定聊天對象資料
        await setReceiverChatRoom({
            loginUserId: userID,
            receiveUserId: receiverID,
            isProvider: false,
        });
        if (providerData.orderID) {
            const origin = window.location.origin;
            const params = new URLSearchParams({ orderID: orderData.demand_id }).toString();
            const host = `${origin}/${lng}/join-providers-chatroom/${receiverID}?${params}`;
            router.push(host);
            return;
        }
        router.push(`/join-providers-chatroom/${receiverID}`);
    };

    const goToOrderDetail = ({ orderID, providerID }: { orderID: string; providerID: string }) => {
        return router.push(`/order/${providerID}/${orderID}`);
    };
    return (
        <section className={tmc(typeof customClass === "string" && customClass, "flex")}>
            <button
                onClick={() => goToOrderDetail({ orderID: orderData.demand_id, providerID: providerData.providerID! })}
                type="button"
            >
                <Image
                    src={providerData.cover}
                    alt="provider avatar"
                    width={100}
                    height={100}
                    style={{ width: "100px", height: "auto" }}
                    className="rounded-md mr-[12px]"
                />
            </button>
            {/* <div className="flex flex-col flex-1 h-[80px] justify-between">
                <h5 className="text-gray-primary font-light text-[15px]">{providerData.name}</h5>
                <div className="flex mt-2">
                    <Image
                        src="/img/icons/rate.svg"
                        width={20}
                        height={20}
                        style={{ width: "10px", height: "auto" }}
                        alt="rate"
                        className="mr-1"
                    />
                    <span className="text-gray-primary text-sm-content">{providerData.rate}</span>
                </div>
                <Image
                    src="/img/icons/queen.svg"
                    width={100}
                    height={100}
                    style={{ width: "70px", height: "auto" }}
                    alt="queen"
                    className="mt-2"
                />
            </div>
            <div className="h-[80px] flex items-center">
                <button
                    onClick={() => goToChatroom(String(providerData.providerID))}
                    className="border rounded-md border-primary h-[27px] text-primary text-sm-content w-[84px]"
                >
                    {t("global.sendMessage")}
                </button>
            </div> */}
        </section>
    );
});

export default OrderByProviderContent;
