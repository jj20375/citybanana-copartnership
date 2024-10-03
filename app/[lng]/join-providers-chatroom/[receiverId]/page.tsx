import Image from "next/image";
import RightNowActivityJoinProviderChatRoomView from "@/views/template1/join-providers-chatroom/[id]/RightNowActivityJoinProviderChatRoomView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng, receiverID }, searchParams: { orderID } }: { params: { lng: string; receiverID: string }; searchParams: { orderID?: string | void } }) {
    return (
        <RightNowActivityJoinProviderChatRoomView
            lng={lng}
            receiverID={receiverID}
            orderID={orderID}
        />
    );
}
