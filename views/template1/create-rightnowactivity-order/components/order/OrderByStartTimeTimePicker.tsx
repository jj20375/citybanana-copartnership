"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { RightNowActivityOrderFormInterface } from "./order-interface";
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
 * 活動開始時間 ui
 */
const OrderByStartTimeTimePicker = memo(
    ({ lng, register, label, value, setValue, required, startDate }: { lng: string; register: UseFormRegister<RightNowActivityOrderFormInterface>; label: Path<RightNowActivityOrderFormInterface>; value: Date | null | undefined; setValue: Function; required: boolean; startDate: Date | null }) => {
        console.log("OrderByStartTimeTimePicker redner =>", value);
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

        const [form, setForm] = useState(value);

        const handleFormChagne = useCallback(
            (val: any) => {
                setForm(val);
                setValue(label, val);
            },
            [form]
        );

        const filterPassedTime = (time: Date) => {
            const currentDate = new Date();
            // 設定開始時間為選擇的日期加上當下時間的 時:分 這樣才能確保剩下的的可選時段為哪些
            const startDateSelect = new Date(dayjs(startDate).add(dayjs().hour(), "hour").add(dayjs().minute(), "minute").toDate());
            const selectedDate = new Date(time);
            if (startDateSelect.getTime() >= currentDate.getTime()) {
                return true;
            }

            return startDateSelect.getTime() < selectedDate.getTime();
        };

        useEffect(() => {
            return setForm(value as Date);
        }, [value]);

        return (
            <>
                <DatePicker
                    {...register(label)}
                    selected={form}
                    onChange={handleFormChagne}
                    className={styles.datepicker}
                    placeholderText={t("rightNowActivityOrder.startTimeTimePicker.placeholder")}
                    showTimeSelect
                    showTimeSelectOnly
                    minTime={setHours(setMinutes(new Date(), 0), 0)}
                    maxTime={setHours(setMinutes(new Date(startDate as Date), 60), 23)}
                    timeIntervals={60}
                    timeCaption={t("global.time")}
                    dateFormat="MM-dd h:mm aa"
                    filterTime={filterPassedTime}
                />
            </>
        );
    }
);

export default OrderByStartTimeTimePicker;
