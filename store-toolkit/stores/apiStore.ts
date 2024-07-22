import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {};

export const apiSlice = createSlice({
    name: "apiSlice",
    initialState,
    reducers: {},
});

export const apiReducer = apiSlice.reducer;
