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
import type { RightNowActivityOrderDetailProviderSigupCardInterface, RightNowActivityOrderProviderCommentInterface } from "../rightnowactivity-order-interface";
// 服務商照片 carousel
import { CarouselByProviderPhotos, CarouselByProviderPhotoItem } from "./RightNowActivityOrderChooseProviderPhotosCarousel";
// 服務商個人資料 carousel
import { CarouselByProviders, CarouselByProviderItem } from "./RightNowActivityOrderChooseProviderCarousel";
// 選擇服務商幻燈片服務商個人介紹資料
import RightNowActivityOrderChooseProviderInfo from "./RightNowActivityOrderChooseProviderInfo";
import styles from "../styles/RightNowActivityOrderProviderCarouselModal.module.scss";
import Image from "next/image";
import { Icon } from "@iconify/react";

/**
 * 選擇服務商彈窗 ui
 */
const RightNowActivityOrderChooseProviderCarouselModal = forwardRef(
    ({ lng, providers, comments, providerIds, setProviderIds }: { lng: string; providers: RightNowActivityOrderDetailProviderSigupCardInterface[]; comments?: RightNowActivityOrderProviderCommentInterface[] | void; providerIds?: string[] | void; setProviderIds: Function }, ref: any) => {
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
                closeIcon={false}
                open={open}
                centered
                maskClosable
                className={styles["provider-carousel-modal"]}
                onCancel={handleCancel}
                footer={
                    [
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
                    ]
                }
            >
                <CarouselByProviders
                    items={providers}
                    key="carouselProviderInfo"
                    renderItem={({ item, index, isSnapPoint }) => (
                        <CarouselByProviderItem
                            key={item.id + "-providerInfo"}
                            index={index}
                            isSnapPoint={isSnapPoint}
                        >
                            <>
                                <div className="relative">
                                    <Icon
                                        className="text-5xl cursor-pointer absolute z-10 text-white bg-black rounded-full bg-opacity-50 left-2 top-2"
                                        icon="iconamoon:arrow-left-2-light"
                                        onClick={handleCancel}
                                    />
                                    <CarouselByProviderPhotos
                                        items={providers}
                                        key="carouselPhotos"
                                        renderItem={({ item, isSnapPoint }) => (
                                            <CarouselByProviderPhotoItem
                                                key={item.id}
                                                isSnapPoint={isSnapPoint}
                                            >
                                                <>
                                                    <Image
                                                        src={item.cover}
                                                        className="w-full rounded-t-lg"
                                                        width={500}
                                                        height={500}
                                                        style={{ width: "100%", height: "auto" }}
                                                        alt="Placeholder"
                                                    />
                                                </>
                                            </CarouselByProviderPhotoItem>
                                        )}
                                    />
                                </div>
                                <RightNowActivityOrderChooseProviderInfo
                                    lng={lng}
                                    providerData={item}
                                    comments={comments}
                                />
                            </>
                        </CarouselByProviderItem>
                    )}
                />
            </Modal>
        );
    }
);

export default RightNowActivityOrderChooseProviderCarouselModal;
