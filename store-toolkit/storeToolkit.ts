import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";

import { authReducer } from "@/store-toolkit/stores/authStore";
import { userReducer } from "@/store-toolkit/stores/userStore";
import { apiReducer } from "@/store-toolkit/stores/apiStore";
import { orderReducer } from "@/store-toolkit/stores/orderStore";
import { createWrapper } from "next-redux-wrapper";

const persistConfig = {
    key: "root",
    storage,
};
const rootReducer = combineReducers({
    authStore: authReducer,
    userStore: userReducer,
    apiStore: apiReducer,
    orderStore: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    });
};

// export const store = configureStore({
//     reducer: { auth: authReducer },

//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
// });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const wrapper = createWrapper<AppStore>(store);
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
