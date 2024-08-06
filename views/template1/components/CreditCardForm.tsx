import { useTranslation } from "@/i18n/i18n-client";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "antd";

/**
 * 信用卡表單 ui
 * @param { type String(字串) } lng 語系
 * @returns
 */
export default function CreditCardForm({ lng, required }: { lng: string; required: boolean }) {
    const { t } = useTranslation(lng, "main");

    return (
        <div className="border border-gray-primary rounded-md p-[17px]">
            <section className="flex flex-col">
                <label htmlFor="">
                    {t("creditCardForm.cardNo.label")}
                    {required && <span className="text-primary">*</span>}
                </label>
                <Input />
            </section>
            <section className="flex mt-[10px]">
                <div className="flex flex-col flex-1 mr-[14px]">
                    <label htmlFor="">
                        {t("creditCardForm.exp.label")}
                        {required && <span className="text-primary">*</span>}
                    </label>
                    <Input />
                </div>
                <div className="flex flex-col flex-1">
                    <label htmlFor="">
                        {t("creditCardForm.cvc.label")}
                        {required && <span className="text-primary">*</span>}
                    </label>
                    <Input />
                </div>
            </section>
        </div>
    );
}
