"use client";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
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
import { userNameSelector, userGenderSelector, setUserProfile } from "@/store-toolkit/stores/userStore";
import { usePartnerStoreCodeSelector, usePartnerStoreVenueCodeSelector } from "@/store-toolkit/stores/partnerStore";
import { RightNowActivityOrderFormInterface } from "../create-rightnowactivity-order/components/order/order-interface";
import ContactWe from "../components/ContactWe";
import RightNowActivityOrderPaymentContactInput from "./components/RightNowActivityOrderPaymentContactInput";
import GenderRadio from "../components/GenderRadio";
import CreditCardForm from "../components/CreditCardForm";
import PaymentMethodsRadio from "../components/PaymentMethodsRadio";
import CreditCardListRadio from "../components/CreditCardListRadio";
import ButtonBorderGradient from "../components/ButtonBorderGradient";
import { GetCreditCardListAPI } from "@/api/userAPI/userAPI";
import { RightNowActivityOrderCreateByCashAPI, RightNowActivityOrderCreateByCreditCardAPI, RightNowActivityOrderCreateByOtherAPI } from "@/api/bookingAPI/bookingAPI";
import { RightNowActivityOrderCreateByCashAPIReqInterface, RightNowActivityOrderCreateByOtherAPIReqInterface } from "@/api/bookingAPI/bookingAPI-interfce";
import { CreditCardDataInterface } from "@/interface/global";
import { RightNowActivityOrderCreateByCreditCardAPIReqInterface } from "@/api/bookingAPI/bookingCreditCarAPI-interface";
export default function RightNowActivityOrderPaymentView({ lng }: { lng: string }) {
    const { t } = useTranslation(lng, "main");
    const title = t("rightNowActivityOrderPayment.title");

    const userStore = useAppSelector((state) => {
        return state.userStore;
    });
    const partnerStore = useAppSelector((state) => {
        return state.partnerStore;
    });

    const userName = userNameSelector(userStore);
    const userGender = userGenderSelector(userStore);
    // 是否為訪客
    const isVisitor = useAppSelector((state) => state.userStore.isVisitor);
    // 合作店家代碼
    const partnerStoreCode = usePartnerStoreCodeSelector(partnerStore);
    // 合作店家地點代碼
    const partnerStoreVenueCode = usePartnerStoreVenueCodeSelector(partnerStore);
    // 判斷是否需要顯示選擇信用卡選項
    const [showChooseCreditCard, setShowChooseCreditCard] = useState(false);
    // 判斷是否需要顯示選擇信用卡選項 (只有在選擇信用卡付款情況下才顯示 信用卡選項)
    const [showChooseCreditCardDom, setShowChooseCreditCardDom] = useState(false);
    // 判斷是否顯示信用卡輸入匡
    const [showCreditCardForm, setShowCreditCardForm] = useState(false);
    // 即刻快閃訂單id
    const [orderID, setOrderID] = useState("");

    // 信用卡表單 dom
    const creditCardFormRef = useRef<any>();

    type FormValues = RightNowActivityOrderPaymentFormInterface;
    type OrderFormValues = RightNowActivityOrderFormInterface;

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
        paymentMethod: yup.string<"cash" | "credit">().required("rightNowActivityOrderPayment.validation.paymentMethod_requiredErrMessage"),
        // 選擇信用卡
        creditCardChoose: yup.string().nullable(),
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
        reset,
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
                needName: isVisitor,
                contactName: "",
                gender: "male",
                paymentMethod: "cash",
                creditCardChoose: null,
            },
        },
    });

    const contactNameValue = watch("payment.contactName");
    const genderValue = watch("payment.gender");
    const paymentMethodValue = watch("payment.paymentMethod");
    const creditCardChooseValue = watch("payment.creditCardChoose");

    // 選擇信用卡選項
    const [paymentMethodOptions, setPaymentMethodOptions] = useState([{ label: t("rightNowActivityOrderPayment.paymentMethod-create-creditCard"), value: "create" }]);
    /**
     * 取得信用卡資料
     */
    const getCreditCardList = useCallback(async () => {
        try {
            const data = await GetCreditCardListAPI();
            if (Array.isArray(data.data) && data.data.length > 0) {
                const list = data.data.map((item) => ({
                    label: item.number,
                    value: String(item.id),
                }));
                // 設定可選擇信用卡選項
                setPaymentMethodOptions([...list, ...paymentMethodOptions]);
                // 是否顯示可選擇信用卡選項
                setShowChooseCreditCard(true);
            }
            console.log("GetCreditCardListAPI data =>", data);
        } catch (err) {
            console.log("GetCreditCardListAPI err =>", err);
            throw err;
        }
    }, []);

    /**
     * 使用現金付款開單
     */
    const orderCreateByCashMethod = async (data: RightNowActivityOrderCreateByCashAPIReqInterface) => {
        try {
            await RightNowActivityOrderCreateByCashAPI(data);
        } catch (err) {
            console.log("RightNowActivityOrderCreateByCashAPI err => ", err);
            throw err;
        }
    };
    // 使用新增信用卡開單並儲存此信用卡
    const createCreditCardUseCreateOrder = () => {
        creditCardFormRef.current.onSubmit();
    };
    /**
     * 使用指定信用卡開單
     */
    const chooseCreditCardCreateOrder = async (data: RightNowActivityOrderCreateByCreditCardAPIReqInterface) => {
        try {
            const res = await RightNowActivityOrderCreateByCreditCardAPI(data);
            console.log("RightNowActivityOrderCreateByCreditCardAPI => ", res);
        } catch (err) {
            console.log("RightNowActivityOrderCreateByCreditCardAPI err => ", err);
            throw err;
        }
    };
    /**
     * 使用非現金付款開單
     */
    const orderCreateByOtherMethod = async (data: RightNowActivityOrderCreateByOtherAPIReqInterface) => {
        try {
            const res = await RightNowActivityOrderCreateByOtherAPI(data);
            // 設定即刻快閃id
            setOrderID(res.demand.demand_id);
            // 判斷有顯示新增信用卡表單時才觸發 代表為新增信用卡付款模式
            if (showCreditCardForm) {
                setTimeout(() => {
                    createCreditCardUseCreateOrder();
                }, 1000);
                return;
            }
            // 判斷使用指定信用卡開單才觸發
            if (creditCardChooseValue !== "create" && showChooseCreditCardDom && typeof creditCardChooseValue === "string") {
                setTimeout(() => {
                    chooseCreditCardCreateOrder({ demand_id: res.demand.demand_id, credit_card_id: creditCardChooseValue, is_default: false });
                }, 1000);

                return;
            }
        } catch (err) {
            console.log("RightNowActivityOrderCreateByCashAPI err => ", err);
            throw err;
        }
    };

    /**
     * submit 成功時往下一步
     * @param data
     */
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log("success form =>", data);
        const sendData: RightNowActivityOrderCreateByCashAPIReqInterface | RightNowActivityOrderCreateByOtherAPIReqInterface = {
            provider_required: order?.requiredProviderCount!,
            unit: order?.unit!,
            hourly_pay: order?.price!,
            district: "TW-TPE",
            location: "abc",
            due_at: dayjs(order?.dueDate!).format("YYYY-MM-DD ") + dayjs(order?.dueTime!).format("HH:mm"),
            started_at: order?.startDate ? dayjs(order?.startDate!).format("YYYY-MM-DD ") + dayjs(order?.startTime!).format("HH:mm") : null,
            description: "123",
            pay_voucher: 0,
            merchant_code: partnerStoreCode,
            venue_code: partnerStoreVenueCode,
            requirement: order?.note!,
            is_x: false,
            duration: order?.duration!,
        };
        if (paymentMethodValue === "cash") {
            await orderCreateByCashMethod(sendData);
            return;
        }
        await orderCreateByOtherMethod(sendData);
        // onNextStepButtonClick();
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    const router = useRouter();
    const onNextStepButtonClick = () => {
        reset();
        const origin = window.location.origin;
        const params = new URLSearchParams(order as any).toString();
        const host = `${origin}/${lng}/rightnowactivity-recruitment-order/1`;
        router.push(`/rightnowactivity-recruitment-order/1`);
    };

    // 上一步按鈕事件
    const onPrevStepButtonClick = () => {
        reset();
        const origin = window.location.origin;
        const host = `${origin}/${lng}/create-rightnowactivity-order`;
        router.push(`${host}?${searchParams.toString()}`);
        return;
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
    // 訂單資料
    const [order, setOrder] = useState<OrderFormValues>();
    // 顯示用的訂單資料
    const [displayOrder, setDisplayOrder] = useState<DisplayOrder>();

    const total = useMemo(() => {
        const priceValue = isEmpty(order) ? 0 : order!.price;
        const durationValue = isEmpty(order) ? 0 : order!.duration;
        return priceValue * durationValue;
    }, [order?.price, order?.duration]);

    useEffect(() => {
        getCreditCardList();
    }, []);
    useEffect(() => {
        // 判斷有網址參數時 需給表單填上預設值
        if (searchParams) {
            // 透過網址參數 設定即刻快閃單資料
            const params = setRightNowActivityDefaultValuesByParams(searchParams);
            if (Object.keys(params).length > 0) {
                setOrder(params);
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
                            value: params.price > 0 ? t("rightNowActivityOrder.price", { val: params.price * params.duration }) : t("rightNowActivityOrderPayment.price-0"),
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
    useEffect(() => {
        // 判斷選擇非新增信用卡時不顯示信用卡表單
        if (creditCardChooseValue !== "create") {
            setShowCreditCardForm(false);
        }
        // 判斷選擇信用卡付款時 顯示選擇信用卡列表
        if (paymentMethodValue === "credit") {
            setShowChooseCreditCardDom(true);
        }
        // 判斷選擇現金付款時 不顯示選擇信用卡列表
        if (paymentMethodValue === "cash") {
            setShowChooseCreditCardDom(false);
        }
        // 判斷選擇信用卡付款時 且不顯示信用卡列表選擇時 顯示信用卡表單
        if (paymentMethodValue === "credit" && !showChooseCreditCard) {
            setShowCreditCardForm(true);
            return;
        }
        // 判斷選擇信用卡付款時 且顯示信用卡列表選擇時 並且選擇新增信用卡選項時 顯示信用卡表單
        if (paymentMethodValue === "credit" && showChooseCreditCard && creditCardChooseValue === "create") {
            setShowCreditCardForm(true);
            return;
        }
    }, [paymentMethodValue, showChooseCreditCard, creditCardChooseValue]);

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
                                    <span className="text-gray-third  text-lg-content mr-[10px]">{item.label}</span> <span className="text-gray-primary text-lg-content OpenSans">{item.value}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <form
                    className="mt-[40px]"
                    onSubmit={handleSubmit(onSubmit, onError)}
                >
                    {isVisitor ? (
                        <>
                            <RightNowActivityOrderPaymentContactInput
                                lng={lng}
                                register={register}
                                label="payment.contactName"
                                value={contactNameValue}
                                setValue={setValue}
                                required={true}
                            />
                            {errors.payment?.contactName && <p className="text-red-600 OpenSans">{errors.payment?.contactName.message}</p>}
                            <GenderRadio
                                lng={lng}
                                label="payment.gender"
                                value={genderValue}
                                setValue={setValue}
                                register={register}
                                required={true}
                                customClass="pt-[15px]"
                            />
                        </>
                    ) : (
                        <>
                            <label className="block mb-[15px] font-bold text-lg-content">
                                {t("rightNowActivityOrderPayment.contact")}
                                <span className="text-primary">*</span>
                            </label>
                            <p className="text-gray-primary text-lg-content">
                                {userName} {t(`global.gender-${userGender}`)} {JSON.stringify(isVisitor)}
                            </p>
                        </>
                    )}

                    <PaymentMethodsRadio
                        lng={lng}
                        label="payment.paymentMethod"
                        value={paymentMethodValue}
                        setValue={setValue}
                        register={register}
                        required={true}
                        customClass="mt-[40px]"
                    />
                    {showChooseCreditCardDom && (
                        <CreditCardListRadio
                            lng={lng}
                            label="payment.creditCardChoose"
                            value={creditCardChooseValue}
                            setValue={setValue}
                            register={register}
                            required={true}
                            paymentMethodOptions={paymentMethodOptions}
                            setShowChooseCreditCard={setShowChooseCreditCard}
                            showChooseCreditCard={showChooseCreditCard}
                            customClass="ml-[30px] mt-[15px]"
                        />
                    )}
                </form>
                {showCreditCardForm && (
                    <CreditCardForm
                        ref={creditCardFormRef}
                        lng={lng}
                        required={true}
                        orderID={orderID}
                        customClass="mt-[15px]"
                    />
                )}
                {/* <button onClick={createCreditCardUseCreateOrder}>測試信用卡表單</button> */}
                <div className="border-b border-gray-primary mt-[40px] flex items-end">
                    <p className="text-gray-primary text-lg-content font-normal flex-1">{t("rightNowActivityOrder.total.label")}</p>
                    <p className="text-primary text-md-title OpenSans">{total === 0 ? t("rightNowActivityOrder.price", { val: Number(total), customPrice: total }) : t("rightNowActivityOrder.price", { val: Number(total) })}</p>
                </div>
                <div className="flex flex-col text-lg-content mt-[40px]">
                    <ButtonBorderGradient
                        onClick={handleSubmit(onSubmit, onError)}
                        buttonText={t("global.nextStep")}
                        outsideClassName={`${!false ? "PrimaryGradient" : "DisabledGradientByOutlineBtn"}  p-px rounded-md w-full`}
                        insideClassName={`${!false ? "PrimaryGradient" : "DisabledGradientByOutlineBtn"} rounded-[calc(0.5rem-3px)] p-2 w-full flex items-center justify-center text-white h-[45px]`}
                        isDisabled={false}
                        buttonType="submit"
                    />
                    <button
                        type="button"
                        onClick={onPrevStepButtonClick}
                        disabled={false}
                        className="mt-[15px] DisabledBg border bg-white border-primary rounded-md w-full h-[45px] text-primary"
                    >
                        {t("rightNowActivityOrderPayment.prevStep")}
                    </button>
                </div>

                <ContactWe lng={lng} />
            </div>
            <pre>{JSON.stringify(displayOrder, null, 4)}</pre>
            <div className="h-[50px]"></div>
            <pre>{JSON.stringify(order, null, 4)}</pre>
        </>
    );
}
