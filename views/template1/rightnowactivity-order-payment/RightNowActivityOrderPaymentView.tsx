"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "@/i18n/i18n-client";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import TitleCompoent from "../components/TitleComponent";
import { useSearchParams, useRouter } from "next/navigation";
import { setRightNowActivityDefaultValuesByParams } from "@/service/rightNowActivityOrder-service";
import { RightNowActivityOrderPaymentFormInterface } from "./rightnowactivity-order-payment-interface";
import { isEmpty } from "@/service/utils";
import dayjs from "dayjs";
import { isValid } from "date-fns";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store-toolkit/storeToolkit";
import { userNameSelector, setUserProfile } from "@/store-toolkit/stores/userStore";
import RightNowActivityOrderPaymentContactInput from "./components/RightNowActivityOrderPaymentContactInput";
import GenderRadio from "../components/GenderRadio";
export default function RightNowActivityOrderPaymentView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const title = t("rightNowActivityOrderPayment.title");

    const state = useAppSelector((state) => {
        return state.userStore;
    });

    const dispatch = useAppDispatch();

    const userName = userNameSelector(state);

    type FormValues = RightNowActivityOrderPaymentFormInterface;

    const paymentFormSchema = yup.object({
        // 判斷是否需要輸入名稱
        needName: yup.boolean(),
        // 聯絡姓名
        contactName: yup.string().when("needName", ([needName], schema) => {
            return needName ? schema.required(t("rightNowActivityOrderPayment.validation.contactName_requiredErrMessage")) : schema.optional();
        }),
        // 性別
        gender: yup.string<"male" | "female">().when("needName", ([needName], schema) => {
            return needName ? schema.required(t("rightNowActivityOrderPayment.validation.gender_requiredErrMessage")) : schema.optional();
        }),
        // 付款方式
        paymentMethod: yup.string(),
    });

    const [schema, setSchema]: any = useState(
        yup
            .object()
            .shape({
                payment: paymentFormSchema,
            })
            .required()
    );

    const {
        register,
        control,
        handleSubmit,
        watch,
        getValues,
        setValue,
        clearErrors,
        trigger,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            payment: {
                needName: isEmpty(userName),
                contactName: "",
                gender: "male",
                paymentMethod: "",
            },
        },
    });

    const contactNameValue = watch("payment.contactName");
    const genderValue = watch("payment.gender");

    /**
     * submit 成功時往下一步
     * @param data
     */
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("success form =>", data);
        // onNextStepButtonClick();
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    const router = useRouter();
    const onNextStepButtonClick = () => {
        const origin = window.location.origin;
        const params = new URLSearchParams(order as any).toString();
        const host = `${origin}/${lng}/phone-validation`;
        router.push(`${host}?${params}`);
    };

    type DisplayOrder = {
        title: string;
        datas: {
            label: string;
            value: string;
        }[];
    };

    // 網址參數
    const searchParams: any = useSearchParams();

    const [order, setOrder] = useState<FormValues | null>(null);
    const [displayOrder, setDisplayOrder] = useState<DisplayOrder>();

    useEffect(() => {
        // 判斷有網址參數時 需給表單填上預設值
        if (searchParams) {
            // 透過網址參數 設定即刻快閃單資料
            const params = setRightNowActivityDefaultValuesByParams(searchParams);
            if (Object.keys(params).length > 0) {
                setOrder(params);
                console.log("isValid(params.startDate) => ", isValid(params.startDate));
                setDisplayOrder({
                    title: "海底撈火鍋-京站店",
                    datas: [
                        {
                            label: t("rightNowActivityOrderPayment.column-startDate"),
                            value: isValid(params.startDate) ? dayjs(params.startTime).format("YYYY-MM-DD HH:mm:ss") : t("rightNowActivityOrderPayment.startTime-now"),
                        },
                        {
                            label: t("rightNowActivityOrderPayment.column-dueDate"),
                            value: isValid(params.dueDate) ? dayjs(params.dueTime).format("YYYY-MM-DD HH:mm:ss") : t("rightNowActivityOrderPayment.dueTime-now", { minute: 60 }),
                        },
                        {
                            label: t("rightNowActivityOrderPayment.column-duration"),
                            value: t("global.hour", { hour: params.duration }),
                        },
                        {
                            label: t("rightNowActivityOrderPayment.column-price"),
                            value: params.price > 0 ? t("global.price", { val: params.price }) : t("rightNowActivityOrderPayment.price-0"),
                        },
                        {
                            label: t("rightNowActivityOrderPayment.column-requiredProviderCount"),
                            value: params.requiredProviderCount + " " + t("global.people"),
                        },
                    ],
                });
            }
        }
    }, [searchParams]);

    return (
        <>
            <TitleCompoent title={title} />
            <div className="mx-auto max-w-[400px] mt-[40px]">
                <div className="border border-gray-third rounded-md p-[15px]">
                    <div className="flex items-center mb-[13px] border-b border-gray-light pb-[13px] font-bold">
                        <Image
                            className="mr-[10px]"
                            src="/img/icons/calendar.svg"
                            width={20}
                            height={20}
                            alt="calendar"
                            style={{ width: "24px", height: "auto" }}
                        />
                        <h5 className="text-sm-title text-gray-primary">{displayOrder?.title}</h5>
                    </div>
                    <ul>
                        {displayOrder?.datas.map((item) => {
                            return (
                                <li
                                    key={item.value}
                                    className="mb-[5px]"
                                >
                                    <span className="text-gray-third  text-lg-content mr-[10px]">{item.label}</span> <span className="text-gray-primary text-lg-content">{item.value}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <form
                    className="mt-[40px]"
                    onSubmit={handleSubmit(onSubmit, onError)}
                >
                    <RightNowActivityOrderPaymentContactInput
                        lng={lng}
                        register={register}
                        label="payment.contactName"
                        value={contactNameValue}
                        setValue={setValue}
                        required={true}
                    />
                    <GenderRadio
                        lng={lng}
                        label="payment.gender"
                        value={genderValue}
                        setValue={setValue}
                        register={register}
                        required={true}
                    />
                    {errors.payment?.contactName && <p className="text-red-600 OpenSans">{errors.payment?.contactName.message}</p>}
                    <button
                        type="submit"
                        className="border bg-blue-500 text-white p-2 border-blue-500 rounded-md"
                    >
                        測試 submit
                    </button>
                </form>
            </div>
            <pre>{JSON.stringify(displayOrder, null, 4)}</pre>
            <div className="h-[50px]"></div>
            <pre>{JSON.stringify(order, null, 4)}</pre>
        </>
    );
}
