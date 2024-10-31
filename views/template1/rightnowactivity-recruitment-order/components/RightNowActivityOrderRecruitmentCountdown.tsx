import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

/**
 * 招募截止時間倒數計時
 */
const RecruitmentCountdown = forwardRef(({ targetDate, customClass }: { targetDate: Date; customClass?: string | void }, ref: any) => {
    dayjs.extend(duration);

    // 設置倒數的目標時間（可以修改為你想要的時間）
    const endTime = dayjs(targetDate);
    const [timeRemaining, setTimeRemaining] = useState("00:00:00");
    // 用來清除 setInterval 變數
    const [intervalId, setIntervalId] = useState<null | any>(null);

    const updateCountdown = () => {
        const now = dayjs();
        const duration = dayjs.duration(endTime.diff(now));

        // 格式化時間為 時:分:秒
        const hours = String(duration.hours()).padStart(2, "0");
        const minutes = String(duration.minutes()).padStart(2, "0");
        const seconds = String(duration.seconds()).padStart(2, "0");

        setTimeRemaining(`${hours}:${minutes}:${seconds}`);

        // 若倒數結束，則清除計時器
        if (duration.asMilliseconds() <= 0) {
            if (intervalId) {
                clearInterval(intervalId);
            }
            setTimeRemaining("00:00:00");
        }
    };

    useEffect(() => {
        setIntervalId(setInterval(updateCountdown, 1000));
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [targetDate]);

    return <div className={`${customClass} text-[28px]`}>{timeRemaining}</div>;
});

export default RecruitmentCountdown;
