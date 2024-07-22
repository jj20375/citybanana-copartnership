import React from "react";
import { Icon } from "@iconify/react";
import { memo } from "react";
import Image from "next/image";
const LoginBg = memo(({ showLogin, setShowLogin, render }: { showLogin: boolean; setShowLogin: Function; render: Function }) => {
    return (
        <div className="bg-white rounded-lg">
            <div className="flex h-full">
                <div className="w-full relative h-[200px]">
                    <Image
                        src="/img/register/red-bg.png"
                        alt="registerBg"
                        layout="fill"
                        sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                        className="rounded-tl-lg"
                    />
                    <div className="absolute text-2xl leading-8 text-white mt-10 ml-5">{render()}</div>
                </div>
                <div className="text-right m-5">
                    <button onClick={() => setShowLogin(false)}>
                        <Icon
                            className="bg-white text-black text-2xl font-thin"
                            icon="formkit:close"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
});
export default LoginBg;
