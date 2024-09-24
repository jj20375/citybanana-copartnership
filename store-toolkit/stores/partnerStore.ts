import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { setFirebaseToken } from "@/service/actions";
import { firebaseLogin } from "@/lib/firebase/firebase-hooks";
import { GetPartnerStoreInfoAPI } from "@/api/partnerStoreAPI/partnerStoreAPI";
import type { GetPartnerStoreInfoAPIResInterface } from "@/api/partnerStoreAPI/partnerStoreAPI-interface";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
export interface PartnerStoreInterFace {
    // 合作店家資料
    partnerStoreInfo: GetPartnerStoreInfoAPIResInterface;
}

const initialState: PartnerStoreInterFace | any = {
    // 合作店家資料
    partnerStoreInfo: {},
};

// 使用createAsyncThunk來處理api的操作
export const getPartnerStoreInfo = createAsyncThunk("getPartnerStoreInfo", async ({ merchantCode, venueCode }: { merchantCode: string; venueCode?: string | void }) => {
    console.log("getPartnerStoreInfo params =>", merchantCode, venueCode);
    try {
        const data = await GetPartnerStoreInfoAPI({ merchantCode, venueCode });
        console.log("GetPartnerStoreInfoAPI =>", data);
        return data;
    } catch (error) {
        console.log("GetPartnerStoreInfoAPI err =>", error);
        throw error;
    }
});

// 合作店家 state 狀態管理
export const partnerSlice = createSlice({
    name: "partnerSlice",
    initialState,
    reducers: {
        // 設定合作店家資料
        setPartnerStoreInfo: (state: { partnerStoreInfo: GetPartnerStoreInfoAPIResInterface }, action: PayloadAction<GetPartnerStoreInfoAPIResInterface>) => {
            state.partnerStoreInfo = action.payload;
        },
    },
    extraReducers: (builder) => {
        // 增加關於fetch data有關三個狀態
        builder
            // 取得合作店家 api 資料中
            .addCase(getPartnerStoreInfo.pending, (state) => {})
            // 取得合作店家 api 成功事件
            .addCase(getPartnerStoreInfo.fulfilled, (state, action) => {
                state.partnerStoreInfo = action.payload;
                if (action.payload) {
                    if (action.payload.merchant && action.payload.merchant.code) {
                        setCookie("merchantCode", action.payload.merchant.code);
                    }
                    if (action.payload.venue !== null && action.payload.venue !== undefined && action.payload.venue.code) {
                        setCookie("venueCode", action.payload.venue.code);
                    }
                }
            })
            // 取得合作店家 api 失敗事件
            .addCase(getPartnerStoreInfo.rejected, (state, action) => {
                console.log("fetchGetFirebaseCustomToken error =>", action.error);
            });
    },
});

const selectSelf = (state: any) => state.partnerStoreInfo;

// 取得店家名稱
export const usePartnerStoreNameSelector = createDraftSafeSelector(selectSelf, (state) => {
    if (!state?.merchant) {
        return "";
    }
    return state?.merchant.name;
});
// 取得店家代碼
export const usePartnerStoreCodeSelector = createDraftSafeSelector(selectSelf, (state) => {
    if (!state?.merchant) {
        return "";
    }
    return state?.merchant.code;
});

// 取得店家桌號名稱
export const usePartnerStoreVenueNameSelector = createDraftSafeSelector(selectSelf, (state) => {
    if (state?.venue === null || state?.venue === undefined) {
        return null;
    }
    return state?.venue.name;
});
// 取得店家桌號代碼
export const usePartnerStoreVenueCodeSelector = createDraftSafeSelector(selectSelf, (state) => {
    if (state?.venue === null || state?.venue === undefined) {
        return null;
    }
    return state?.venue.code;
});

export const { setPartnerStoreInfo } = partnerSlice.actions;
export const partnerReducer = partnerSlice.reducer;
