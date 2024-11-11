"use client";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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
    ({ lng, providers, showChooseButton, buttonText, buttonMethod }: { lng: string; providers: RightNowActivityOrderDetailProviderSigupCardInterface[]; showChooseButton: boolean; buttonText?: string | void; buttonMethod?: Function | void }, ref: any) => {
        const { t } = useTranslation(lng, "main");
        const [open, setOpen] = useState(false);
        useImperativeHandle(ref, () => ({
            openModal: () => {
                setOpen(true);
            },
        }));

        const handleCancel = () => {
            setOpen(false);
        };

        const handleButtonMethod = (providerID: string) => {
            if (buttonMethod) {
                buttonMethod(providerID);
                handleCancel();
                return;
            }
        };

        useEffect(() => {
            if (open) {
                document.body.style.position = "fixed";
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.position = "";
                document.body.style.overflow = "";
            }
            return () => {
                document.body.style.position = "";
                document.body.style.overflow = "";
            };
        }, [open]);

        return (
            <Modal
                title={<div></div>}
                closeIcon={false}
                open={open}
                centered
                maskClosable
                className={styles["provider-carousel-modal"]}
                onCancel={handleCancel}
                footer={[]}
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
                                        items={item.photos!}
                                        isQueen={item.isQueen}
                                        key="carouselPhotos"
                                        renderItem={({ item, isSnapPoint }) => (
                                            <CarouselByProviderPhotoItem
                                                key={item}
                                                isSnapPoint={isSnapPoint}
                                            >
                                                <>
                                                    <Image
                                                        src={item}
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
                                    showChooseButton={showChooseButton}
                                    providerData={item}
                                    buttonText={buttonText}
                                    buttonMethod={() => handleButtonMethod(item.id)}
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
