import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";

/**
 * 招募截止時間倒數計時
 */
const RecruitmentCountdown = forwardRef(({ initialSeconds, customClass }: { initialSeconds: number; customClass?: string | void }, ref: any) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isCounting, setIsCounting] = useState(true);
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

    useEffect(() => {
        setSeconds(initialSeconds);
    }, [initialSeconds]);

    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return <div className={`${customClass} text-center text-[48px] text-primary`}>{isCounting ? formatTime(seconds) : ""}</div>;
});

export default RecruitmentCountdown;
