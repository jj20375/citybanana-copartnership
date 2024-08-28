"use client";

import { memo, useState } from "react";
import { message, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import Image from "next/image";

const ChatRoomUpload = memo(({ lng }: { lng: string }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("files[]", file as FileType);
        });
        setUploading(true);
        // You can use any AJAX library you like
        fetch("https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then(() => {
                setFileList([]);
                message.success("upload successfully.");
            })
            .catch(() => {
                message.error("upload failed.");
            })
            .finally(() => {
                setUploading(false);
            });
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);

            return false;
        },
        fileList,
    };
    return (
        <Upload
            className="absolute h-full right-[90px] top-[10px]"
            {...props}
        >
            <button>
                <Image
                    src="/img/icons/photo.svg"
                    width={100}
                    height={100}
                    alt="chatroom photo"
                    style={{ width: "30px", height: "auto" }}
                />
            </button>
        </Upload>
    );
});

export default ChatRoomUpload;
