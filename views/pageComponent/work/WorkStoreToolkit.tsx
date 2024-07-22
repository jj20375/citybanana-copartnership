import { store, useAppSelector, useAppDispatch } from "@/store-toolkit/storeToolkit";
import { setAuthState } from "@/store-toolkit/stores/authStore";
import { getUserProfile } from "@/store-toolkit/stores/userStore";
import Link from "next/link";

export default function WorkStoreToolkit() {
    const authState = useAppSelector((state) => {
        console.log("workstate =>", state);
        return state.authStore.authState;
    });
    // console.log("storeToolkit store =>", store);

    const dispatch = useAppDispatch();
    return (
        <>
            <button onClick={() => dispatch(setAuthState(true))}>Login</button>
            <button onClick={() => dispatch(setAuthState(false))}>Logout</button>
            <button onClick={() => dispatch(getUserProfile())}>getUser</button>
            <Link
                className="bg-red-500 text-white rounded-lg px-2"
                href={{
                    pathname: "/firebase/users/uqvwseu697",
                }}
            >
                firebase page
            </Link>
            <div className="text-2xl">authState:{JSON.stringify(authState)}</div>
        </>
    );
}
