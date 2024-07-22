import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

export interface IsAuthState {
    authState: boolean;
}

const initialState: IsAuthState = {
    authState: false,
};

export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setAuthState: (state, action: PayloadAction<boolean>) => {
            console.log("action.payload =>", action);
            state.authState = action.payload;
        },
    },
});

export const { setAuthState } = authSlice.actions;
export const authReducer = authSlice.reducer;
