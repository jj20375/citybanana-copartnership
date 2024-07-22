import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function WorkPage() {
    const router = useRouter();
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

    return (
        <>
            <div className="text-red-500">is work-{router.query.slug}</div>
            <button onClick={() => add(data.length + 1)}>add</button>
            {data.map((item: any) => (
                <div key={item}>{item}</div>
            ))}
        </>
    );
}
