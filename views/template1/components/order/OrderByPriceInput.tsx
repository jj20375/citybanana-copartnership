"use client";

import { memo } from "react";
import type { UseFormRegister, Path } from "react-hook-form";
import { RightNowActivityOrderFormInterface } from "./orderInterface";

const OrderByPriceInput = memo(({ register, label, value, setValue }: { register: UseFormRegister<RightNowActivityOrderFormInterface>; label: Path<RightNowActivityOrderFormInterface>; value: number; setValue: Function }) => {
    function changeValue(newValue: number) {
        setValue("order.price", newValue);
    }

    return (
        <>
            <input {...register(label)} />
            <div className="text-red-500">{value}</div>
            <button onClick={() => changeValue(100)}>測試更改價格</button>
        </>
    );
});

export default OrderByPriceInput;
