import Image from "next/image";
import RightNowActivityJoinProviderChatRoomView from "@/views/template1/join-providers-chatroom/[id]/RightNowActivityJoinProviderChatRoomView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <RightNowActivityJoinProviderChatRoomView lng={lng} />;
}
