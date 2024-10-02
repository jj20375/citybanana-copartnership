import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../storeToolkit";

export interface UtilityStoreInterface {
    // 前台顯示設定值
    clientUiSettings: any;
    // 錯誤語系檔
    errorMessageLang: any;
}

const initialState: UtilityStoreInterface = {
    // 前台顯示設定值
    clientUiSettings: [],
    // 錯誤語系檔
    errorMessageLang: {},
};

export const utilitySlice = createSlice({
    name: "utilitySlice",
    initialState,
    reducers: {
        // 設定即刻快閃開單設定值資料
        setClientUiSettings: (state, action: PayloadAction<any>) => {
            state.clientUiSettings = action.payload;
        },
        // 設定錯誤語系檔
        setErrorMessageLang: (state, action: PayloadAction<any>) => {
            state.errorMessageLang = action.payload;
        },
    },
});

const selectClientUiSettings = (state: any) => state.clientUiSettings;
// 判斷是否有開啟免平台服務費折抵
export const isFreeFee = createDraftSafeSelector(selectClientUiSettings, (state: any) => state.enable_sales_to_fee);

export const { setClientUiSettings, setErrorMessageLang } = utilitySlice.actions;
export const utilityReducer = utilitySlice.reducer;
