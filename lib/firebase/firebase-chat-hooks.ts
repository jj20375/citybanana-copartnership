import firebase from "firebase/compat/app";
import firebaseAPP from "./firebase-config";
import * as _ from "lodash";
import { UserProfileInterface } from "@/interface/user";
import dayjs from "dayjs";
import { message } from "antd";
/**
 * 取得 chat_rooms中聊天對象 未讀訊息數量總計 未讀訊息總數量
 * @param { type String(字串) } loginUserID 登入使用者id
 */
export const firebaseGetChatRoomUnReadMessageCountTotal = async (loginUserID: string) => {
    try {
        // 取得所有聊天對象資料 並 過濾掉客服聊天對象
        let chatrooms = await firebaseAPP.collection(`chat_rooms/${loginUserID}/users`).where(firebase.firestore.FieldPath.documentId(), "!=", process.env.SERVICE_CHAT_ID).get();
        // 沒有取得資料時不往下執行
        if (chatrooms.empty) {
            return 0;
        }
        // 未讀訊息數量
        let unReadCounts: number[] = [];
        chatrooms.forEach((chatroom: { data: Function }) => {
            // 計算未讀訊息數量 (判斷是否有未讀訊息數量)
            if (chatroom.data().unReadMessageCount !== undefined) {
                // 判斷非 NaN 對象才加入 unReadCounts
                if (!isNaN(parseInt(chatroom.data().unReadMessageCount))) {
                    // 新增未讀訊息數量
                    unReadCounts.push(parseInt(chatroom.data().unReadMessageCount));
                }
            }
        });
        // 總計未讀訊息數量
        return _.sum(unReadCounts);
    } catch (err) {
        console.log("firebaseGetChatRoomUnReadMessageCountTotal err =>", err);
        return false;
    }
};

/**
 * 檢查指定使用者是否有建立過 chat_rooms 資料
 * @param { type String(字串) } userId  使用者id
 */
export const firebaseCheckUserChatRoomEmpty = async (userId: string) => {
    try {
        let doc = await firebaseAPP.doc(`chat_rooms/${userId}`).get();
        // 找不到此 user 聊天室時給 true
        if (!doc.exists) {
            return true;
        }
        return false;
    } catch (err) {
        console.log("firebaseCheckUserChatRoomEmpty err =>", err);
        return false;
    }
};

/**
 * 建立使用者聊天室chat_rooms 資料
 * @param { type Object(物件) } userData 使用者資料
 * @param { type String(字串) } userID 建立對象 id
 * @returns
 */
export const firebaseSetUserChatRoom = async (userData: UserProfileInterface, userID: string) => {
    let doc = await firebaseAPP.doc(`chat_rooms/${userID}/`).get();
    return new Promise(async (resolve: Function, reject: Function) => {
        if (!doc.exists) {
            try {
                await firebaseAPP.doc(`chat_rooms/${userID}`).set({ userData, isProvider: userData.role ? (userData.role > 0 ? true : false) : false, unReadMessageCount: 0, unReadMessageCountByServiceChat: 0, enableCityAi: false, updatedAt: dayjs().valueOf() });
                resolve();
            } catch (err) {
                reject();
                return message.open({
                    type: "error",
                    content: "建立個人資料聊天室失敗",
                });
            }
            return;
        }
        try {
            await firebaseAPP.doc(`chat_rooms/${userID}`).update({ userData, isProvider: userData.role ? (userData.role > 0 ? true : false) : false, updatedAt: dayjs().valueOf() });
            resolve();
        } catch (err) {
            return message.open({
                type: "error",
                content: "更新個人資料聊天室失敗",
            });
        }
    });
};

/**
 * 聊天室對象 未讀訊息歸 0
 * @param { type String(字串) } loginUserID  登入使用者id
 * @param { type String(字串) } receiverID  聊天對象使用者id
 */
export const firebaseMessageReaded = async (loginUserID: string, receiverID: string) => {
    try {
        await firebaseAPP.doc(`chat_rooms/${loginUserID}/users/${receiverID}`).update({ unReadMessageCount: 0, updatedAt: dayjs().valueOf() });
        return { success: true };
    } catch (err) {
        console.log("firebaseMessageReaded err =>", err);
        return err;
    }
};

/**
 * 更新 chat_rooms 中指定對象 所有未讀訊息數量
 * @param { type String(字串) } userID 使用者id
 * @param { type Number(數字) } unReadMessageCount 未讀訊息數量總計
 */
export const firebaseUpdateUserUnReadMessageCount = async (userID: string, unReadMessageCount: number) => {
    try {
        // 更新未讀訊息數量
        await firebaseAPP.doc(`chat_rooms/${userID}`).update({ unReadMessageCount, updatedAt: dayjs().valueOf() });
    } catch (err) {
        console.log("firebaseUpdateUserUnReadMessageCount err =>", err);
        return err;
    }
};
