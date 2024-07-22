"use client";
import { signIn, auth } from "@/auth";
import { useEffect, Suspense, useState, useCallback } from "react";
import useUserStore from "@/store-zustand/userStore";
import { useAppDispatch, useAppSelector } from "@/store-toolkit/storeToolkit";

function FormPage() {
    const [form, setForm] = useState({ phone: "", password: "" });

    const handleFormChagne = useCallback(
        (event: any) => {
            const { name, value } = event.target;
            console.log("work=>", value, name);
            setForm((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [form]
    );
    return (
        <div>
            <div className="mb-2 text-black">
                <input className="text-black" value={form.phone} onChange={handleFormChagne} name="phone" />
                <div className="text-white">{form.phone}</div>
            </div>
            <div className="text-black">
                <input className="text-black" value={form.password} onChange={handleFormChagne} name="password" />
                <div className="text-white">{form.password}</div>
            </div>
        </div>
    );
}

export default function Work4Page() {
    const dispatch = useAppDispatch();
    const userProfile = useAppSelector((state) => state.userStore.user);

    const userStore = useUserStore();
    const user = userStore.user;
    return (
        <>
            <div>work4 template1</div>
            <FormPage />
            <div>zustand user: {user ? JSON.stringify(user.birthday, null, 4) : user}</div>
            <div>redux user: {userProfile ? JSON.stringify(userProfile.birthday, null, 4) : userProfile}</div>
        </>
    );
}
