"use client";
import { ButtonType } from "antd/es/button";
import { ButtonHTMLAttributes, memo } from "react";
const ButtonBorderGradient = memo(({ buttonText, onClick, outsideClassName, insideClassName, isDisabled, buttonType = "button" }: { buttonText: string; onClick: any; outsideClassName?: string | void; insideClassName?: string | void; isDisabled: boolean; buttonType: "button" | "submit" }) => (
    <div
        onClick={onClick}
        className={`${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} w-full flex items-center justify-center bg-white`}
    >
        <div className={`${outsideClassName}`}>
            <div className={`${insideClassName}`}>
                <button
                    type={buttonType}
                    className={`${isDisabled ? "cursor-not-allowed" : "cursor-pointer"} w-full`}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    </div>
));

export default ButtonBorderGradient;
