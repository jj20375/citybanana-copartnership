import { createSlice } from "@reduxjs/toolkit";
import { ChatReceiverInterface } from "@/interface/chats";

const initialState: {
    chatReceiver: ChatReceiverInterface;
} = {
    chatReceiver: {
        id: "",
        name: "",
    },
};

export const chatSlice = createSlice({
    name: "chatSlice",
    initialState,
    reducers: {
        setChatReceiver: (state, action) => {
            console.log("setReceiver payload =>", action.payload);
            state.chatReceiver = action.payload;
        },
    },
});

export const { setChatReceiver } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
