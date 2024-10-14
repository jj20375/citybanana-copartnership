"use cliet";
import firebase from "firebase/compat/app";
import firebaseAPP from "./firebase-config";
import { User } from "@/api/authAPI/authAPI-interface";
import dayjs from "dayjs";
import { isEmpty } from "@/service/utils";
import { UserProfileInterface } from "@/interface/user";
// cloud firestore 連接方式
export function firebaseDb() {
    return firebaseAPP.firestore();
}
// cloud firestore doc 連接方式
export function firebaseDbDoc(path: string) {
    return firebaseAPP.firestore().doc(path);
}
// cloud firestore collection 連接方式
export function firebaseDbCollection(path: string) {
    return firebaseAPP.firestore().collection(path);
}
// firebase fcm 功能測試
export function firebaseMessaging() {
    return firebaseAPP.messaging();
}
// firebase realtime database Connect
export function firebaseConnectRef(path: string) {
    return firebaseAPP.database().ref(path);
}
// firebase auth
export function firebaseAuth() {
    return firebaseAPP.auth();
}
// firebase storage
export function firebaseStorage() {
    return firebaseAPP.storage();
}
/**
 * firebase 登入改為永久時效性方法
 * @param { type String(字串) } token customToken
 * @returns
 */
export async function firebaseLogin(token: string) {
    try {
        // 將登入改為永久時效性 除非執行登出才會失效
        await firebaseAPP.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        // 執行 firebase 登入
        await firebaseAPP.auth().signInWithCustomToken(token);
    } catch (error: any) {
        console.log("firebaseLogin error => ", error);
        let { code: errorCode, message: errorMessage } = error;
        return { errorCode, errorMessage };
    }
}

// 登入firebase auth 事件
export async function isOnAuthStateChange() {
    firebaseAuth().onAuthStateChanged(async (userData: any) => {
        if (userData === null) {
            console.log("work firebase auth error", userData);
            // await chatStore.getFirebaseToken({ isRegister: true });
        } else {
            console.log("firebase userData =>", userData);
            // if (userStore.isAuth && !$utils().isEmpty(token)) {
            //     console.log("work firebase auth success");
            //     // 登入時需要監聽的機制
            //     chatStore.loginNeedConnect();
            //     // 取得瀏覽器 device token
            //     chatStore.getDeviceTokenAndUpload();
            // }

            const messaging = firebaseMessaging();
            firebaseMessaging().onMessage(
                (payload: any) => {
                    console.log("message fcm client", payload);
                },
                (e: any) => {}
            );
        }
    });
}

/**
 * 取得 firebase 使用者資料
 */
export async function firebaseGetUserData(userID: string) {
    try {
        let user = await firebaseDbDoc(`chat_rooms/${userID}`).get();
        if (!user.exists) {
            return {};
        }
        return user.data();
    } catch (err) {
        console.log("取得chat_rooms 使用者資料失敗", err);
        return err;
    }
}

/**
 * firebase firestore 版本
 * 創建firebase使用者資料方法 並且設定已上線或未上線
 * @param { type Object(物件) } userData 使用者資料
 * @param { type String(字串) } userID 使用者id
 */
export const firebaseOnlineSet = async (userData: UserProfileInterface, userID: string) => {
    console.log("firebase online", userData, userID);
    if (userData !== undefined && userData !== null && userID !== undefined) {
        console.log("firebase online2");
        // 新增使用者登入狀態
        firebaseConnectRef(".info/connected").on("value", async (snapshot: any) => {
            console.log("firebase online3");
            if (snapshot.val() === false) {
                console.log("firebase online4");
                return;
            }
            // 取得登入者資料
            let data = await firebaseGetUserData(userID);
            // 判斷有 firebase 使用者資料
            if (Object.keys(data).length > 0) {
                console.log("firebase online5");
                // 取得未讀訊息數量 如果沒有責給預設值 0
                let unReadMessageCount = isEmpty(data.unReadMessageCount) ? 0 : data.unReadMessageCount;
                // 取得是否啟用 cityAi 設定
                let enableCityAi = isEmpty(data.enableCityAi) ? false : data.enableCityAi;
                // 更新 user 資料
                try {
                    await firebaseDbDoc(`chat_rooms/${userID}`).update({ userData, unReadMessageCount, enableCityAi, updatedAt: dayjs().valueOf(), online: true, offlineTime: null });
                } catch (err) {
                    console.log("更新，上線狀態值，失敗", err);
                }
            } else {
                // 創建 user 資料
                try {
                    await firebaseDbDoc(`chat_rooms/${userID}`).set({ userData, updatedAt: dayjs().valueOf(), online: true, offlineTime: null });
                } catch (err) {
                    console.log("新增，上線狀態值，失敗", err);
                }
            }

            // 創建登入資料
            let ref = firebaseConnectRef("user_online").child(userID);
            // 登入狀態表參數值
            ref.set({ online: true, name: userData.name });
            // 如果連線失敗了 就執行登出
            ref.onDisconnect().set({ online: false, name: userData.name, offlineTime: firebase.database.ServerValue.TIMESTAMP });
            // .then(async () => {
            //     try {
            //         await db().doc(`chat_rooms/${userId}`).update({
            //             status: "offline",
            //             offlineTime: firebase.firestore.FieldValue.serverTimestamp(),
            //         });
            //         console.log("if set offline");
            //     } catch (err) {
            //         console.log("設定離線狀態失敗", err);
            //     }
            // });
        });
    }
};

/**
 * 取消 firebase 監聽
 * @param { type String(字串) } userId 登入者 banana_id
 */
export const firebaseOnlineSetDetachListeners = async (userID?: null | void | string, isLogout?: boolean | void) => {
    // 判斷 userID 是否為 null 以及是登出事件時才執行
    if (userID !== null && isLogout) {
        // 將狀態改為 offline
        try {
            await firebaseDbDoc(`chat_rooms/${userID}`).update({ online: false, offlineTime: dayjs().valueOf() });
        } catch (err) {
            console.log("取消監聽時 設定離線狀態失敗", err);
        }
    }
    firebaseConnectRef(".info/connected").off();
    firebaseConnectRef("user_online").off();
};
