import Image from "next/image";
import RightNowActivityJoinProvidersChatRoomListView from "@/views/template1/join-providers-chatroom/RightNowActivityJoinProvidersChatRoomListView";
import { useTranslation } from "@/i18n";

export default async function Page({ params: { lng } }: { params: { lng: string } }) {
    return <RightNowActivityJoinProvidersChatRoomListView lng={lng} />;
}
