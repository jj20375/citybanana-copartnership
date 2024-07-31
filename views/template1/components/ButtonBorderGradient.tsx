"use client";
import { memo } from "react";
const ButtonBorderGradient = memo(({ buttonText, onClick, outsideClassName, insideClassName }: { buttonText: string; onClick: any; outsideClassName?: string | void; insideClassName?: string | void }) => (
    <div
        onClick={onClick}
        className="flex cursor-pointer items-center justify-center bg-white"
    >
        <div className={`${outsideClassName}`}>
            <div className={`${insideClassName}`}>
                <button className="w-full">{buttonText}</button>
            </div>
        </div>
    </div>
));

export default ButtonBorderGradient;
