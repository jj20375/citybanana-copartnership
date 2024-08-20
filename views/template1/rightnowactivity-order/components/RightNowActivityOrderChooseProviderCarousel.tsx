import React, { CSSProperties, useRef } from "react";
import { useSnapCarousel } from "react-snap-carousel";
import { motion, useScroll, useTransform } from "framer-motion";
import { tmc } from "@/service/utils";

// https://github.com/richardscarrott/react-snap-carousel

const styles = {
    nextPrevButton: {},
    nextPrevButtonDisabled: { opacity: 0.3 },
    pagination: {
        display: "flex",
    },
    paginationButton: {
        margin: "5px",
        opacity: 0.2,
    },
    paginationButtonActive: { opacity: 1 },
    pageIndicator: {
        display: "flex",
        justifyContent: "center",
    },
} satisfies Record<string, CSSProperties>;

interface CarouselProps<T> {
    readonly items: T[];
    readonly renderItem: (props: CarouselRenderItemProps<T>) => React.ReactElement<CarouselItemProps>;
}

interface CarouselRenderItemProps<T> {
    readonly item: T;
    readonly index: number;
    readonly isSnapPoint: boolean;
}

/**
 * 選擇服務商幻燈片 ui
 * @param param0
 * @returns
 */
export const CarouselByProviders = <T extends any>({ items, renderItem }: CarouselProps<T>) => {
    const { scrollRef, pages, activePageIndex, prev, next, goTo, snapPointIndexes } = useSnapCarousel();
    return (
        <div className="relative rounded-md">
            <ul
                ref={scrollRef}
                className="snap-x flex relative overflow-auto scroll-smooth snap-mandatory"
            >
                {items.map((item, index) =>
                    renderItem({
                        item,
                        index,
                        isSnapPoint: snapPointIndexes.has(index),
                    })
                )}
            </ul>
            <div
                aria-hidden
                className="absolute bottom-2 mx-auto w-full flex items-center justify-center"
            >
                {/* <button
                    style={{
                        ...styles.nextPrevButton,
                        ...(activePageIndex === 0 ? styles.nextPrevButtonDisabled : {}),
                    }}
                    onClick={() => prev()}
                >
                    {String.fromCharCode(8592)}
                </button> */}
                {/* {pages.map((_, i) => (
                    <button
                        key={i}
                        className={`${activePageIndex === i ? "bg-gray-primary" : "bg-gray-light"} m-[5px] rounded-full `}
                        onClick={() => goTo(i)}
                    >
                        <div className="w-[10px] h-[10px] rounded-full"></div>
                    </button>
                ))} */}
                {/* <button
                    style={{
                        ...styles.nextPrevButton,
                        ...(activePageIndex === pages.length - 1 ? styles.nextPrevButtonDisabled : {}),
                    }}
                    onClick={() => next()}
                >
                    {String.fromCharCode(8594)}
                </button> */}
            </div>
            {/* <div style={styles.pageIndicator}>
                {activePageIndex + 1} / {pages.length}
            </div> */}
        </div>
    );
};

interface CarouselItemProps {
    readonly isSnapPoint: boolean;
    readonly index: number;
    readonly children?: React.ReactNode;
}

/**
 * 選擇服務商幻燈片內容 ui
 * @param param0
 * @returns
 */
export const CarouselByProviderItem = ({ isSnapPoint, index, children }: CarouselItemProps) => (
    <motion.li
        initial={{ opacity: 0, y: 150 }}
        whileInView={{ opacity: 1, y: 0 }}
        className={tmc(isSnapPoint && "snap-center", index === 0 ? "mr-1" : "mx-1", "h-auto snap-normal rounded-lg bg-white shrink-0 w-[calc(100%-3em)]")}
    >
        {children}
    </motion.li>
);
