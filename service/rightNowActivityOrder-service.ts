import { isEmpty } from "@/service/utils";
import dayjs from "dayjs";

// 透過網址參數 設定即刻快閃單預設資料
export function setRightNowActivityDefaultValuesByParams(searchParams: any) {
    // 判斷有網址參數時 需給表單填上預設值
    if (searchParams) {
        const params: any = {};
        for (const [key, value] of searchParams?.entries()) {
            if (!isEmpty(value)) {
                if (key === "duration") {
                    params[key] = Number(value);
                } else if (key === "requiredProviderCount") {
                    params[key] = Number(value);
                } else if (key === "price") {
                    params[key] = Number(value);
                } else if (key === "startDate" && !isEmpty(value)) {
                    params[key] = dayjs(value).toDate();
                } else if (key === "startTime" && !isEmpty(value)) {
                    params[key] = dayjs(value).toDate();
                } else if (key === "dueDate" && !isEmpty(value)) {
                    console.log("due date => ", value);
                    params[key] = dayjs(value).toDate();
                } else if (key === "dueTime" && !isEmpty(value)) {
                    params[key] = dayjs(value).toDate();
                } else {
                    params[key] = value;
                }
            }
        }
        return params;
    }
    return {};
}
