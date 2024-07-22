import useMyFetch from "@/service/http-request";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function RefreshTokenAPI(token?: string | null) {
    const options: { method: string; token?: string } = { method: "post" };
    if (token) {
        options.token = token;
    }
    return useMyFetch(`${apiURL}/auth/refresh`, options);
}
