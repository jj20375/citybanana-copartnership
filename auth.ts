async function refreshAccessToken(tokenObject: any) {
    // try {
    //     // Get a new set of tokens with a refreshToken
    //     const tokenResponse = await axios.post(YOUR_API_URL + 'auth/refreshToken', {
    //         token: tokenObject.refreshToken
    //     });
    //     return {
    //         ...tokenObject,
    //         accessToken: tokenResponse.data.accessToken,
    //         accessTokenExpiry: tokenResponse.data.accessTokenExpiry,
    //         refreshToken: tokenResponse.data.refreshToken
    //     }
    // } catch (error) {
    //     return {
    //         ...tokenObject,
    //         error: "RefreshAccessTokenError",
    //     }
    // }
}
import Credentials from "next-auth/providers/credentials";
import { LoginUserAPI } from "@/api/userAPI";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";

export const config = {
    theme: { logo: "https://authjs.dev/img/logo-sm.png" },
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                phone: { label: "手機" },
                password: { label: "密碼" },
            },
            async authorize(request: any) {
                try {
                    const user = await LoginUserAPI(request);
                    // return user object with the their profile data
                    return user;
                } catch (err) {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }: any) => {
            console.log("jwt token =>", token);
            console.log("jwt user =>", user);

            if (user) {
                token.accessToken = user.access_token;
                token.accessTokenExpiry = user.expires_in;
                token.refreshToken = user.access_token;
                token.user = user;
            }
            return Promise.resolve(token);
            // if (user) {
            //     // This will only be executed at login. Each next invocation will skip this part.
            //     token.accessToken = user.data.accessToken;
            //     token.accessTokenExpiry = user.data.accessTokenExpiry;
            //     token.refreshToken = user.data.refreshToken;
            // }

            // // If accessTokenExpiry is 24 hours, we have to refresh token before 24 hours pass.
            // const shouldRefreshTime = Math.round((token.accessTokenExpiry - 60 * 60 * 1000) - Date.now());

            // // If the token is still valid, just return it.
            // if (shouldRefreshTime > 0) {
            //     return Promise.resolve(token);
            // }

            // // If the call arrives after 23 hours have passed, we allow to refresh the token.
            // token = refreshAccessToken(token);
            // return Promise.resolve(token);
        },
        session: async ({ session, token }: any) => {
            console.log("session =>", session);
            console.log("session token =>", token);
            session.accessToken = token.accessToken;
            session.accessTokenExpiry = token.accessTokenExpiry;
            session.user = token.user;
            return Promise.resolve(session);
            // // Here we pass accessToken to the client to be used in authentication with your API
            // session.accessToken = token.accessToken;
            // session.accessTokenExpiry = token.accessTokenExpiry;
            // session.error = token.error;

            // return Promise.resolve(session);
        },
    },
    basePath: "/auth",
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
