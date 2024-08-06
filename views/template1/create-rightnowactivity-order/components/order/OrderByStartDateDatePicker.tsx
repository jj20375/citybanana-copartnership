"use client";
import { memo, useState, useCallback, useEffect } from "react";
import { useTranslation } from "@/i18n/i18n-client";
import { useAppSelector } from "@/store-toolkit/storeToolkit";
import { RightNowActivityOrderCreateFormInterface } from "./order-interface";
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

import { addDays, getYear, getMonth, subDays, addHours } from "date-fns";

/**
 * 招募截止日期 ui
 */
const OrderByStartDateDatePicker = memo(
    ({ lng, register, label, value, setValue, required }: { lng: string; register: UseFormRegister<RightNowActivityOrderCreateFormInterface>; label: Path<RightNowActivityOrderCreateFormInterface>; value: Date | null | undefined; setValue: Function; required: boolean }) => {
        const state = useAppSelector((state) => state.orderStore);
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
        // 即刻快閃緩衝時間
        const rightNowActivityWaitHour = rightNowActivityWaitHourSelector(state);
        // 開始日期只能選到30天之內
        const thirtyDaysAgo = addDays(new Date(), 30);
        // datePicker 客製化標題時需要的 年份選擇
        const yearOptions = Array.from({ length: getYear(new Date()) }, (_, i) => i + 1);
        // 創建 datePicker 客製化標題時需要的 月份選擇
        function createMonthArray() {
            const months = [];
            for (let i = 0; i < 12; i++) {
                months.push(dayjs().month(i).format("MMMM"));
            }
            return months;
        }
        // datePicker 客製化標題時需要的 月份選擇
        const monthOptions = createMonthArray();
        // 自定義 datePicker 日期選擇樣式
        const renderDayContents = (day: any, date: any) => {
            return <span>{day}</span>;
        };
        // 自定義 datePicker 頂部選擇月份與年份樣式
        const renderDatePickerHeader = ({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }: any) => (
            <div
                style={{
                    margin: 10,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <button
                    className="mr-5"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                >
                    {"<"}
                </button>
                <select
                    value={dayjs(date).year()}
                    onChange={({ target: { value } }: any) => changeYear(value)}
                >
                    {yearOptions.map((option: any) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    ))}
                </select>

                <select
                    value={monthOptions[getMonth(date)]}
                    onChange={({ target: { value } }) => changeMonth(monthOptions.indexOf(value))}
                >
                    {monthOptions.map((option) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    ))}
                </select>

                <button
                    className="ml-5"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                >
                    {">"}
                </button>
            </div>
        );

        const [form, setForm] = useState(value);

        const handleFormChagne = useCallback(
            (val: any) => {
                setForm(val);
                setValue(label, val);
            },
            [form]
        );

        useEffect(() => {
            setForm(value);
        }, [value]);

        return (
            <DatePicker
                {...register(label)}
                selected={form}
                onChange={handleFormChagne}
                className={styles.datepicker}
                calendarClassName={styles.datepicker_calender}
                placeholderText={t("rightNowActivityOrder.startDateDatePicker.placeholder")}
                wrapperClassName={styles.datepicker__input}
                maxDate={thirtyDaysAgo}
                minDate={addHours(new Date(), rightNowActivityWaitHour)}
                renderDayContents={renderDayContents}
                dayClassName={(date) => {
                    return dayjs(date).format("YYYY-MM-DD") === dayjs(form).format("YYYY-MM-DD") ? "!bg-red-500 !text-white !rounded-full" : "!bg-white";
                }}
                renderCustomHeader={renderDatePickerHeader}
                dateFormat="YYYY MMM dd"
            />
        );
    }
);

export default OrderByStartDateDatePicker;
