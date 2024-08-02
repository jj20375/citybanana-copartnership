"use client";
import { memo } from "react";
const ButtonBorderGradient = memo(({ buttonText, onClick, outsideClassName, insideClassName, isDisabled }: { buttonText: string; onClick: any; outsideClassName?: string | void; insideClassName?: string | void; isDisabled: boolean }) => (
    <div
        onClick={onClick}
        className={`${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} flex items-center justify-center bg-white`}
    >
        <div className={`${outsideClassName}`}>
            <div className={`${insideClassName}`}>
                <button className={`${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} w-full`}>{buttonText}</button>
            </div>
        </div>
    </div>
));

export default ButtonBorderGradient;
