import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../storeToolkit";

export const utilitySlice = createSlice({
    name: "utilitySlice",
    initialState: {
        // 前台顯示設定值
        clientUiSettings: [],
    },
    reducers: {
        // 設定即刻快閃開單設定值資料
        setClientUiSettings: (state, action: PayloadAction<any>) => {
            state.clientUiSettings = action.payload;
        },
    },
});

const selectClientUiSettings = (state: RootState) => state.utilityStore.clientUiSettings;
// 判斷是否有開啟免平台服務費折抵
export const isFreeFee = createDraftSafeSelector(selectClientUiSettings, (state: any) => state.enable_sales_to_fee);

export const { setClientUiSettings } = utilitySlice.actions;
export const utilityReducer = utilitySlice.reducer;
