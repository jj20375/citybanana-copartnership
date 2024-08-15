"use client";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Checkbox } from "antd";
import { useTranslation } from "@/i18n/i18n-client";
import ButtonBorderGradient from "../../components/ButtonBorderGradient";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// 服務商報名卡片 interface
import type { RightNowActivityOrderDetailProviderSigupCard } from "../rightnowactivity-order-interface";
// 服務商照片 carousel
import { CarouselByProviderPhotos, CarouselByProviderPhotoItem } from "./RightNowActivityOrderChooseProviderPhotosCarousel";
// 服務商個人資料 carouse
import { CarouselByProviders, CarouselByProviderItem } from "./RightNowActivityOrderChooseProviderCarousel";
// 選擇服務商幻燈片服務商個人介紹資料
import RightNowActivityOrderChooseProviderInfo from "./RightNowActivityOrderChooseProviderInfo";
/**
 * 選擇服務商彈窗 ui
 */
const RightNowActivityOrderChooseProviderCarouselModal = forwardRef(({ lng, providers, providerIds, setProviderIds }: { lng: string; providers: RightNowActivityOrderDetailProviderSigupCard[]; providerIds?: string[] | void; setProviderIds: Function }, ref: any) => {
    const { t } = useTranslation(lng, "main");
    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
        },
    }));

    type FormValues = {
        form: {
            providerIds: string[];
        };
    };

    const formSchema = {
        providerIds: yup.array(),
    };
    const [schema, setSchema]: any = useState(
        yup
            .object()
            .shape({
                form: yup.object().shape(formSchema),
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
        reset,
        trigger,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            form: {
                providerIds: [],
            },
        },
    });

    const handleCancel = () => {
        reset();
        setOpen(false);
    };

    /**
     * submit 成功時往下一步
     * @param data
     */
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log("success form =>", data);
        if (Object.keys(errors).length > 0) {
            return;
        }
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log("error form =>", errors);
        // 可以在這裡執行其他操作，比如記錄錯誤、顯示通知等
    };

    const items = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        src: `https://picsum.photos/500?idx=${i}`,
    }));

    return (
        <Modal
            title={<div></div>}
            open={open}
            centered
            maskClosable
            onCancel={handleCancel}
            footer={[
                // <form
                //     key="form"
                //     className="flex"
                //     onSubmit={handleSubmit(onSubmit, onError)}
                // >
                //     <button
                //         type="submit"
                //         className="w-full PrimaryGradient text-white rounded-md"
                //     >
                //         {t("global.choose")}
                //     </button>
                // </form>,
                <CarouselByProviders
                    items={providers}
                    key="carouselProviderInfo"
                    renderItem={({ item, isSnapPoint }) => (
                        <CarouselByProviderItem
                            key={item.id + "-providerInfo"}
                            isSnapPoint={isSnapPoint}
                        >
                            <>
                                <CarouselByProviderPhotos
                                    items={providers}
                                    key="carouselPhotos"
                                    renderItem={({ item, isSnapPoint }) => (
                                        <CarouselByProviderPhotoItem
                                            key={item.id}
                                            isSnapPoint={isSnapPoint}
                                        >
                                            <>
                                                {item.id}
                                                <img
                                                    src={item.cover}
                                                    className="w-full"
                                                    height="250"
                                                    alt="Placeholder"
                                                />
                                            </>
                                        </CarouselByProviderPhotoItem>
                                    )}
                                />
                                <RightNowActivityOrderChooseProviderInfo
                                    lng={lng}
                                    providerData={item}
                                />
                            </>
                        </CarouselByProviderItem>
                    )}
                />,
            ]}
        ></Modal>
    );
});

export default RightNowActivityOrderChooseProviderCarouselModal;
