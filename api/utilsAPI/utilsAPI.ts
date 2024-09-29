import useMyFetch from "@/service/http-request";
import { GetJobListAPIResInterface } from "./utilsAPI-interface";
const apiURL = process.env.NEXT_PUBLIC_API_URL;
const apiNestJSURL = process.env.NEXT_PUBLIC_API_NESTJS_URL;

/**
 *  取得職業列表 api
 */
export async function GetJobListAPI(): Promise<GetJobListAPIResInterface> {
    return useMyFetch(`${apiURL}/categories/occupations`, {
        method: "get",
    });
}
