"use client";

import { FaRegUser } from "react-icons/fa";
import { useState } from "react";
import HeaderLoginDialog from "./HeaderLoginDialog";

export default function LoginBtn() {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div>
            <button
                className="flex"
                onClick={() => setShowLogin(true)}
            >
                <FaRegUser className="text-2xl" />
                <span className="ml-2">登入</span>
            </button>
            <HeaderLoginDialog
                showLogin={showLogin}
                setShowLogin={setShowLogin}
            />
        </div>
    );
}
