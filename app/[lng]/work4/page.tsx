import ClientExample from "./client-sample";
import ClientExample2 from "./client-sample2";
import { headers } from "next/headers";

function Template() {
    const referer = headers().get("host");

    if (referer === process.env.NEXT_PUBLIC_HOST_SITE) {
        // 判斷 tmp1 網域 layout
        return <ClientExample />;
    } else if (referer === process.env.NEXT_PUBLIC_X_SITE) {
        // 判斷 tmp2 網域 layout
        return <ClientExample2 />;
    }
    // 預設 tmp1 網域 layout
    return <ClientExample />;
}

export default async function ClientPage() {
    return <Template />;
}
