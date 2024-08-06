import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../storeToolkit";
// collection 陣列 中指定 key 找到陣列資料方法
import * as _ from "lodash";

export const orderSlice = createSlice({
    name: "orderSlice",
    initialState: {
        // 即刻快閃開單設定值
        rightNowActivityConfiguration: [],
    },
    reducers: {
        // 設定即刻快閃開單設定值資料
        setRightNowActivityConfiguration: (state, action: PayloadAction<any>) => {
            state.rightNowActivityConfiguration = action.payload;
        },
    },
});

const selectRightNowActivityConfiguration = (state: any) => state.rightNowActivityConfiguration;
// console.log("selectRightNowActivityConfiguration =>", selectRightNowActivityConfiguration());
// 即刻快閃預設預訂時數
export const rightNowActivityDefaultHourDurationSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => {
    return Number(_.find(state, { key: "demand_hour_default_duration" }) !== undefined ? _.find(state, { key: "demand_hour_default_duration" }).value : null);
});

// 即刻快閃最少預訂時數
export const rightNowActivityHourMinDurationSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_hour_min_duration" }).value));

// 即刻快閃最大預訂時數
export const rightNowActivityHourMaxDurationSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_hour_max_duration" }).value));

// 即刻快閃預設預訂天數
export const rightNowActivityDefaultDayDurationSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_day_default_duration" }).value));

// 即刻快閃最少預訂天數
export const rightNowActivityDayMinDurationSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_day_min_duration" }).value));

// 即刻快閃最大預訂天數
export const rightNowActivityDayMaxDurationSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_day_max_duration" }).value));

// 即刻快閃緩衝時間
export const rightNowActivityDueAtLimitSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_due_at_limit" }).value));

// 即刻快閃最少招募人數
export const rightNowActivityProviderMinRequiredSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_provider_min_required" }).value));

// 即刻快閃最多招募人數
export const rightNowActivityProviderMaxRequiredSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_provider_max_required" }).value));

// 即刻快閃開放區域
export const rightNowActivityOpenAreasSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => JSON.parse(_.find(state, { key: "demand_open_areas" }).value));

// 即刻快閃緩衝時間 (單位小時 n+1)
export const rightNowActivityWaitHourSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_wait_hour" }).value + 1));

// 即刻快閃每小時最低單價
export const rightNowActivityHourMinPriceSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => {
    return Number(
        _.find(state, {
            key: "demand_hour_min_price",
        }).value
    );
});

// 即刻快閃服務商報價每小時最低單價
export const rightNowActivityHourMinPriceByProviderSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_hour_min_price_provider" }).value));

// 即刻快閃每小時最高單價
export const rightNowActivityHourMaxPriceSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_hour_max_price" }).value));

// 即刻快閃每天最低單價
export const rightNowActivityDayMinPriceSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_day_min_price" }).value));

// 即刻快閃每天最高單價
export const rightNowActivityDayMaxPriceSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => Number(_.find(state, { key: "demand_day_max_price" }).value));

// 即刻快閃每小時單價選項
export const rightNowActivityDefaultHourPriceSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => (_.find(state, { key: "demand_default_hour_price" }) !== undefined ? JSON.parse(_.find(state, { key: "demand_default_hour_price" }).value) : null));

// 即刻快閃每天單價選項
export const rightNowActivityDefaultDayPriceSelector = createDraftSafeSelector(selectRightNowActivityConfiguration, (state) => JSON.parse(_.find(state, { key: "demand_default_day_price" }).value));

export const { setRightNowActivityConfiguration } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
