"use client";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { LoginUserAPI, GetIndexAPI } from "@/api/userAPI/userAPI";
import { useAppDispatch } from "@/store-toolkit/storeToolkit";
import { setAuthState } from "@/store-toolkit/stores/authStore";
import { setIsProvider, setUserProfile } from "@/store-toolkit/stores/userStore";
import { setToken } from "@/service/actions";
import { usePathname } from "next/navigation";

async function getData() {
    try {
        const data = await GetIndexAPI();
        return data;
    } catch (err) {}
}

function FormPage() {
    const dispatch = useAppDispatch();
    async function login({ phone, password }: { phone: string; password: string }) {
        try {
            const data = await LoginUserAPI({ phone, password });
            console.log("login data =>", data);
            dispatch(setUserProfile(data.user));
            dispatch(setIsProvider(data.user.role !== 0 ? true : false));
            setToken({
                token: data.access_token,
                expiresTime: data.expires_in,
            });
        } catch (err) {}
    }

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
                <input
                    className="text-black border"
                    value={form.phone}
                    onChange={handleFormChagne}
                    name="phone"
                />
                <div className="text-black">{form.phone}</div>
            </div>
            <div className="text-black">
                <input
                    className="text-black border"
                    value={form.password}
                    onChange={handleFormChagne}
                    name="password"
                />
                <div className="text-black">{form.password}</div>
            </div>
            <button
                className=""
                onClick={() => login(form)}
            >
                登入
            </button>
        </div>
    );
}

export default function Page({ params: { slug } }: { params: { slug: string } }) {
    console.log("rerender work3");
    const dispatch = useAppDispatch();
    // const user = useAppSelector((state) => state.userStore.user);

    // getUserProfile();
    // const form: any = useRef({ phone: "", password: "" });
    // const handleFormChagne = useCallback(
    //     (event: any) => {
    //         const { name, value } = event.target;
    //         console.log("work=>", value, name);
    //         form[name] = value;
    //     },
    //     [form]
    // );
    const indexData = getData();
    useEffect(() => {}, []);
    const pathName = usePathname();

    return (
        <>
            <div>
                <Link
                    className="bg-red-500 text-white rounded-lg px-2"
                    href={{
                        pathname: "/work2/1",
                        query: { name: "test" },
                    }}
                >
                    test router work2
                </Link>
                <Link
                    className="bg-blue-500 text-white rounded-lg px-2"
                    href={{
                        pathname: "/work4",
                        query: { name: "test" },
                    }}
                >
                    test router work4
                </Link>
            </div>
            <div>work3</div>
            <Link
                className="bg-red-500 text-white rounded-lg px-2"
                href={{
                    pathname: "/firebase/users/uqvwseu697",
                }}
            >
                firebase page
            </Link>
            <button
                className="bg-white text-green-500 p-5 rounded-lg"
                onClick={() => dispatch(setAuthState(true))}
            >
                設定auth 登入
            </button>
            <FormPage />
            {/* <button onClick={() => dispatch(fetchUserProfileAPI())}>getUser</button> */}
            <div>pathName: {pathName}</div>
            index:{JSON.stringify(indexData, null, 4)}
            {/* user:{JSON.stringify(user, null, 4)} */}
        </>
    );
}
