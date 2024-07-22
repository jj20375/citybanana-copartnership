"use client";
import useSWR, { SWRConfig } from "swr";

export default function SWRConfigProvider({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig
            value={{
                fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
                errorRetryCount: 2,
            }}
        >
            {children}
        </SWRConfig>
    );
}
