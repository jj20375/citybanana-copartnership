"use cliet";
import firebase from "firebase/compat/app";
import firebaseAPP from "./firebase-config";
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
