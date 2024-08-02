import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";

/**
 * 倒數計時按鈕 ui
 */
const CountdownButton = forwardRef(({ initialSeconds, buttonText, className }: { initialSeconds: number; buttonText: string; className?: string | void }, ref: any) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isCounting, setIsCounting] = useState(false);
    const timerRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        startCountdown: () => {
            if (!isCounting) {
                setIsCounting(true);
            }
        },
        cancelCountdown: () => {
            clearInterval(timerRef.current);
            setIsCounting(false);
            setSeconds(initialSeconds); // Reset to initial value
        },
    }));

    useEffect(() => {
        if (isCounting) {
            timerRef.current = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds <= 1) {
                        clearInterval(timerRef.current);
                        setIsCounting(false);
                        return 0;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [isCounting]);

    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <button
            type="button"
            onClick={() => ref.current.startCountdown()}
            className={`${className} PrimaryGradient rounded-md DisabledGradient text-white w-[120px] flex items-center justify-center`}
            disabled={isCounting}
        >
            {isCounting ? formatTime(seconds) : buttonText}
        </button>
    );
});

export default CountdownButton;
