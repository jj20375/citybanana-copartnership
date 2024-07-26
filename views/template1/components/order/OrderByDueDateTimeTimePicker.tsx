"use client";
import { memo, useState, useCallback, useEffect } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { RightNowActivityOrderFormInterface } from "./orderInterface";
import type { UseFormRegister, Path } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zhTW } from "date-fns/locale/zh-TW";
import { enUS } from "date-fns/locale/en-US";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { rightNowActivityWaitHourSelector } from "@/store-toolkit/stores/orderStore";

import styles from "./styles/OrderByDatePicker.module.scss";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw"; // 引入繁體中文
import "dayjs/locale/en"; // 引入西班牙文

import { addDays, getYear, getMonth, subDays, addHours, setHours, setMinutes } from "date-fns";

/**
 * 招募日期
 */
const OrderByDueDateTimeTimePicker = memo(
    ({
        lng,
        register,
        label,
        value,
        setValue,
        required,
        startDate,
        startTime,
        dueDate,
    }: {
        lng: string;
        register: UseFormRegister<RightNowActivityOrderFormInterface>;
        label: Path<RightNowActivityOrderFormInterface>;
        value: Date | null;
        setValue: Function;
        required: boolean;
        startDate: Date;
        startTime: string;
        dueDate: Date;
    }) => {
        const { t } = useTranslation(lng, "main");
        // 設定日期套件語系
        switch (lng) {
            case "zh-TW":
                // detePicker 語系註冊
                registerLocale("zh-TW", zhTW);
                // detePicker 語系設定
                setDefaultLocale("zh-TW");
                // dayjs 語系設定
                dayjs.locale("zh-tw");
                break;
            case "en":
                // detePicker 語系註冊
                registerLocale("en-US", enUS);
                // detePicker 語系設定
                setDefaultLocale("en-US");
                // dayjs 語系設定
                dayjs.locale("en");
                break;
            default:
                // detePicker 語系註冊
                registerLocale("zh-TW", zhTW);
                // detePicker 語系設定
                setDefaultLocale("zh-TW");
                // dayjs 語系設定
                dayjs.locale("zh-tw");
        }

        const [form, setForm] = useState(dayjs(dueDate).toDate());

        const handleFormChagne = useCallback(
            (val: any) => {
                console.log("work =>", val);
                setForm(val);
                setValue(label, dayjs(val).format("HH:mm"));
            },
            [form]
        );

        useEffect(() => {
            setForm(new Date(dueDate));
        }, [dueDate]);

        const filterPassedTime = (time: Date) => {
            const currentDate = new Date();
            let dueDateSelect = new Date(dayjs(dueDate).toDate());
            // 判斷開始時間等於現在時間需加上現在的時辰時間 ps. 這樣才可以知道 今天只剩下哪些時段能選擇
            if (dayjs(dueDateSelect).format("YYYY-MM-DD") === dayjs(currentDate).format("YYYY-MM-DD")) {
                dueDateSelect = new Date(dayjs(dueDateSelect).add(dayjs().hour(), "hours").toDate());
            }
            // 活動開始日期 加上 選擇的活動開始時辰
            const startDateTimeSelect = new Date(dayjs(startDate + " " + startTime).toDate());
            // 時間選擇器的日期時間
            const selectedDate = new Date(time);
            // 判斷當活動開始時間 > 招募截止時間 時觸發
            if (startDateTimeSelect.getTime() > dueDateSelect.getTime()) {
                // 當活動日期 與招募截止日期同一天時觸發
                if (startDate === dueDate) {
                    return startDateTimeSelect.getTime() > selectedDate.getTime();
                }
            }
            return dueDateSelect.getTime() < selectedDate.getTime();
        };

        return (
            <DatePicker
                {...register(label)}
                selected={form}
                onChange={handleFormChagne}
                className={styles.datepicker}
                placeholderText={t("rightNowActivityOrder.startTimeTimePicker.placeholder")}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={60}
                minTime={setHours(setMinutes(new Date(), 0), 0)}
                maxTime={setHours(setMinutes(new Date(startDate), 60), 23)}
                timeCaption="時間"
                dateFormat="YYYY-MM-dd h:mm aa"
                filterTime={filterPassedTime}
            />
        );
    }
);

export default OrderByDueDateTimeTimePicker;
