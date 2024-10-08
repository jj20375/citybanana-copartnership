import { createSlice, createAsyncThunk, createDraftSafeSelector } from "@reduxjs/toolkit";
import { GetFirebaseCustomTokenAPI, GetUserProfileAPI } from "@/api/userAPI/userAPI";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserProfileInterface } from "@/interface/user";
import { setFirebaseToken } from "@/service/actions";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { firebaseLogin } from "@/lib/firebase/firebase-hooks";
import { RootState } from "../storeToolkit";
export interface UserStore {
    user: UserProfileInterface;
    isLoading: boolean;
    // 判斷是否為服務商
    isProvider: boolean;
    // 判斷是否為訪客身份(代表首次註冊)
    isVisitor: boolean;
    // 判斷 firebase 是否為登入狀態
    isFirebaseAuth: boolean;
}

const initialState: UserStore | any = {
    user: {
        name: "123",
        banana_id: "",
        wallet: {},
    },
    isLoading: false,
    // 判斷是否為服務商
    isProvider: false,
    // 判斷是否為訪客身份(代表首次註冊)
    isVisitor: false,
    // 判斷 firebase 是否為登入狀態
    isFirebaseAuth: false,
};

// const dispatch = useAppDispatch();
// const authState = useAppSelector((state) => {
//     console.log("workstate =>", state);
//     return state.authStore.authState;
// });

// 使用createAsyncThunk來處理api的操作
export const getUserProfile = createAsyncThunk("getUserProfile", async () => {
    console.log("get user profile2");
    try {
        const data = await GetUserProfileAPI();
        console.log("user profile =>", data);
        return data;
    } catch (error) {
        console.log("getUserProfile err =>", error);
        throw error;
    }
});

/**
 * 取得 firebase custom token
 */
export const fetchGetFirebaseCustomToken = createAsyncThunk("fetchGetFirebaseCustomToken", async () => {
    try {
        const data = await GetFirebaseCustomTokenAPI();
        return data;
    } catch (error) {
        throw error;
    }
});

/**
 * firebase 登入
 */
export const fetchFirebaseLogin = createAsyncThunk("fetchFirebaseLogin", async (token: string) => {
    try {
        await firebaseLogin(token);
    } catch (err) {
        console.log("fetchFirebaseLogin err =>", err);
        throw err;
    }
});

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUserProfile: (state: { user: UserProfileInterface }, action: PayloadAction<UserProfileInterface>) => {
            state.user = action.payload;
        },
        // 設定是否為服務商
        setIsProvider: (state: { isProvider: boolean }, action: PayloadAction<boolean>) => {
            state.isProvider = action.payload;
        },
        // 設定是否為訪客身份(代表首次註冊)
        setIsVisitor: (state: { isVisitor: boolean }, action: PayloadAction<boolean>) => {
            state.isVisitor = action.payload;
        },
        getAuth: (state: any, action) => {
            console.info("getAuth state =>", state, action);
        },
        // 設定 firebase 登入狀態
        setIsFirebaseAuth: (state: any, action: PayloadAction<boolean>) => {
            state.isFirebaseAuth = action.payload;
        },
    },
    extraReducers: (builder) => {
        // 增加關於fetch data有關三個狀態
        builder
            .addCase(fetchGetFirebaseCustomToken.pending, (state) => {
                state.isLoading = true; // 正在fetch資料
            })
            .addCase(fetchGetFirebaseCustomToken.fulfilled, (state, action) => {
                console.log("fetchGetFirebaseCustomToken payload =>", action.payload);
                state.isLoading = false; // fetch 成功
            })
            // 取得 firebase 登入 token 失敗
            .addCase(fetchGetFirebaseCustomToken.rejected, (state, action) => {
                state.isLoading = false; // fetch失敗
                state.isFirebaseAuth = false;
                console.log("fetchGetFirebaseCustomToken error =>", action.error);
            })
            // 登入 firebase 成功
            .addCase(fetchFirebaseLogin.fulfilled, (state, action) => {
                console.log("fetchFirebaseLogin payload =>", action.payload);
                state.isFirebaseAuth = true;
                setFirebaseToken({ expiresTime: 60 * 60 });
            })
            // 登入 firebase 失敗
            .addCase(fetchFirebaseLogin.rejected, (state, action) => {
                console.log("fetchFirebaseLogin payload =>", action.payload);
                state.isFirebaseAuth = false;
                setFirebaseToken({ expiresTime: 60 * 60 });
            })
            // 取得 user profile 成功
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

const selectSelf = (state: any) => state.user;

export const userNameSelector = createDraftSafeSelector(selectSelf, (state) => {
    return state?.name;
});
export const userBananaIdSelector = createDraftSafeSelector(selectSelf, (state) => {
    return state?.banana_id;
});
// 使用者性別
export const userGenderSelector = createDraftSafeSelector(selectSelf, (state) => {
    return state?.gender;
});

export const { setUserProfile, setIsProvider, setIsVisitor, getAuth } = userSlice.actions;
export const userReducer = userSlice.reducer;
