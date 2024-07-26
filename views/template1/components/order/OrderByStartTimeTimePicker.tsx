"use client";
import { memo, useState, useEffect, useCallback } from "react";
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
const OrderByStartTimeTimePicker = memo(
    ({ lng, register, label, value, setValue, required, startDate }: { lng: string; register: UseFormRegister<RightNowActivityOrderFormInterface>; label: Path<RightNowActivityOrderFormInterface>; value: Date | null; setValue: Function; required: boolean; startDate: Date }) => {
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
                console.log("work =>", val);
                setForm(val);
                setValue(label, dayjs(val).format("HH:mm"));
            },
            [form]
        );

        const filterPassedTime = (time: Date) => {
            const currentDate = new Date();
            const startDateSelect = new Date(dayjs(startDate).add(dayjs().hour(), "hours").toDate());
            const selectedDate = new Date(time);
            if (startDateSelect.getTime() >= currentDate.getTime()) {
                return true;
            }

            return startDateSelect.getTime() < selectedDate.getTime();
        };

        useEffect(() => {
            setForm(new Date(startDate));
        }, [startDate]);

        return (
            <DatePicker
                {...register(label)}
                selected={form}
                onChange={handleFormChagne}
                className={styles.datepicker}
                placeholderText={t("rightNowActivityOrder.startTimeTimePicker.placeholder")}
                showTimeSelect
                showTimeSelectOnly
                minTime={setHours(setMinutes(new Date(), 0), 0)}
                maxTime={setHours(setMinutes(new Date(startDate), 60), 23)}
                timeIntervals={60}
                timeCaption="時間"
                dateFormat="YYYY-MM-dd h:mm aa"
                filterTime={filterPassedTime}
            />
        );
    }
);

export default OrderByStartTimeTimePicker;
