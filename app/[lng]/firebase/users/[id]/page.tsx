"use client";
import { firebaseDbCollection } from "@/lib/firebase/firebase-hooks";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch, store } from "@/store-toolkit/storeToolkit";
import { userNameSelector, userBananaIdSelector, getAuth } from "@/store-toolkit/stores/userStore";
export default function Page({ params: { id } }: { params: { id: string } }) {
    const [users, setUsers] = useState([]);
    async function getUsers() {
        const chatUsersRef = firebaseDbCollection(`chat_rooms/${id}/users`);
        try {
            // 聊天對象名單 collection
            let queryUsers: any = await chatUsersRef.orderBy("lastMsgAt", "asc").limit(10).get();
            let result: any = [];
            queryUsers.forEach((item: any) => {
                result = [...result, item.data()];
            });
            setUsers(result);
        } catch (err) {
            console.log("getUsers err =>", err);
        }
    }
    const authState = useAppSelector((state) => {
        return state.authStore.authState;
    });
    const state = useAppSelector((state) => {
        return state.userStore;
    });
    const userProfile = useAppSelector((state) => state);
    const dispatch = useAppDispatch();
    const userName = userNameSelector(state);
    const userBananaId = userBananaIdSelector(state);
    useEffect(() => {
        dispatch(getAuth(authState));
        getUsers();
    }, []);

    return (
        <>
            <div className="text-2xl">authState:{JSON.stringify(authState)}</div>
            <div className="text-2xl">userName:{userName}</div>
            <div className="text-2xl">userBananaId:{userBananaId}</div>
            {/* <div className="text-2xl">userProfile:{JSON.stringify(userProfile)}</div> */}
            <div className="text-blue-200">{JSON.stringify(users, null, 4)}</div>
        </>
    );
}
