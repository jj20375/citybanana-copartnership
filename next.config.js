const path = require("path");

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },

    reactStrictMode: true,
    serverRuntimeConfig: {},
    publicRuntimeConfig: {
        apiURL: process.env.API_CONFIG,
        /**
         * firebase config
         */
        firebase_APIKey: process.env.FIREBASE_API_KEY,
        firebase_authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        firebase_projectId: process.env.FIREBASE_PROJECT_ID,
        firebase_storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        firebase_messagingSenderId: process.env.FIREBASE_MESSAGINGSENDER_ID,
        firebase_appId: process.env.FIREBASE_APP_ID,
        firebase_measurementId: process.env.FIREBASE_MEASUREMENT_ID,
        firebase_databaseURL: process.env.FIREBASE_DATABASEURL,
        firebase_messagingKey: process.env.FIREBASE_MESSAGING_KEY,
        google_recaptcha2Key: process.env.GOOGLE_RECAPTCHA2_KEY,
    },
    experimental: {
        serverActions: true,
    },
    compiler: {
        // 刪除 console.* 內容
        // removeConsole: {
        //     // 只留下 console.error 內容
        //     exclude: ["error"],
        // },
    },
    images: {
        // 圖片緩存時間 單位秒
        minimumCacheTTL: 300,
        formats: ["image/avif", "image/webp"],
    },
};
