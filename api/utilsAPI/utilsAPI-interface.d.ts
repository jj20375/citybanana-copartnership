/**
 *  取得職業列表 api 回應參數
 */
export interface GetJobListAPIResInterface {
    occupations: { id: string; name: string }[];
    [property: string]: any;
}
