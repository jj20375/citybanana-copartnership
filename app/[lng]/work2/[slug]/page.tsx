"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useParams, usePathname } from "next/navigation";
export default function WorkPage({ params: { slug } }: { params: { slug: string } }) {
    const fetcher = (...args: any) => fetch(args).then((res) => res.json());
    const { data: fetchData, error, isLoading }: any = useSWR("https://banana_api.com/api/expo/web/index", fetcher);
    let [data, setData] = useState([123]);
    function add(val: number) {
        // const datas = data;
        // datas.push(val);
        // console.log("datas =>", datas);
        setData((item) => [...item, val]);
    }

    useEffect(() => {
        // Happens when `count` changes

        return () => {
            console.log("work data =>", data);
            // Optional; clean up when `count` changed
        };
    }, [data]);

    const pathName = usePathname();
    const params = useParams();
    const regexName = /\/work2/.test(pathName!);

    return (
        <>
            <Link
                href={{
                    pathname: "/work3",
                    query: { name: "test" },
                }}
            >
                test router
            </Link>

            <div>pathName: {pathName}</div>
            <div>params: {JSON.stringify(params)}</div>
            <div>regexName: {regexName ? "true" : "false"}</div>
            <div className="text-red-500">is work-{slug}</div>
            <button onClick={() => add(data.length + 1)}>add</button>
            {data.map((item: any) => (
                <div key={item}>{item}</div>
            ))}
            <div className="text-2xl text-blue-500">is work{slug}</div>
            <div>
                <pre>{JSON.stringify(fetchData, null, 4)}</pre>
            </div>
        </>
    );
}
