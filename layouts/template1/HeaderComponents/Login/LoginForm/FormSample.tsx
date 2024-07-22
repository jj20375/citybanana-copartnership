import { useForm, Controller, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles/HeaderLoginInputDatepicker.module.scss";
import * as yup from "yup";
import dayjs from "dayjs";
import { addYears } from "date-fns";

type FormValues = {
    startDate: Date;
    user: {
        name: string;
        birthdate: Date;
    };
};

const schema = yup
    .object()
    .shape({
        startDate: yup.date().required("日期為必填"),
        user: yup.object().shape({
            name: yup.string().required("姓名為必填").max(10, "姓名最多10個字"),
            birthdate: yup
                .date()
                .required("生日為必填")
                .test("is-18", "最少必須為18歲", function (value) {
                    console.log("is 18 =>", value);
                    return value ? addYears(value, 18) <= new Date() : false;
                }), // 限制必須至少 18 歲
        }),
    })
    .required();

// 設置最小日期為 18 年前
const eighteenYearsAgo = addYears(new Date(), -18);

export default function HeaderLoginInput() {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
    };

    const disabledDate = (currentDate: Date) => {
        const d = dayjs(currentDate);
        const today = dayjs();
        if (d.isAfter(today)) {
            return true;
        }
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log(errors);
        alert("Form validation failed. Please correct the errors and try again.");
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-2"
        >
            <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                    <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        className={styles.datepicker}
                        calendarClassName={styles.datepicker}
                        placeholderText="請選擇開始日期"
                        wrapperClassName={styles.datepicker__input}
                        maxDate={eighteenYearsAgo}
                    />
                )}
            />
            {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
            <input
                type="text"
                {...register("user.name")}
                placeholder="請輸入名稱"
                className="border-b border-gray-400"
            />
            {errors.user?.name && <p className="text-red-500">{errors.user?.name.message}</p>}
            <Controller
                control={control}
                name="user.birthdate"
                render={({ field }) => (
                    <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        className={styles.datepicker}
                        calendarClassName={styles.datepicker}
                        placeholderText="請選擇生日"
                        wrapperClassName={styles.datepicker__input}
                    />
                )}
            />
            {errors.user?.birthdate && <p className="text-red-500">{errors.user?.birthdate.message}</p>}
            <button
                type="submit"
                className="p-2 border border-gray-300 rounded"
            >
                Submit
            </button>
        </form>
    );
}
