"use client";

import { UploadDropzone } from "@/lib/uploadthing";

// here is the problem of sidebar bug remove it and move to global css
// import "@uploadthing/react/styles.css";

interface FileUploadProps {
  endpoint: "serverImage" | "serverMessage";
  value: string;
  onChange: (url?: string) => void;
}
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

export const FileUpload: React.FC<FileUploadProps> = ({
  endpoint,
  value,
  onChange,
}) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-44 w-64">
        <Image src={value} alt="upload" fill unoptimized />

        <button
          onClick={() => onChange("")}
          type="button"
          className="bg-rose-500 rounded-full p-1 text-white absolute top-0 right-0 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>

        <button
          onClick={() => onChange("")}
          type="button"
          className="bg-rose-500 rounded-full p-1 text-white absolute top-0 right-0 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      className="border-2 w-96 h-48 border-dashed border-orange-300 rounded-md flex justify-center items-center cursor-pointer transition-colors duration-200 hover:border-gray-500 focus:border-orange-500 focus:outline-none"
      endpoint={endpoint}
      appearance={{
        button:
          "bg-orange-500 text-white rounded-md px-4 py-2 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
        container:
          "w-full border-2 border-dashed border-orange-300 rounded-md p-4 flex flex-col items-center justify-center",
        allowedContent: "text-gray-500 text-sm mb-2",
      }}
      content={{
        label: "Chọn hình ảnh dịch vụ",
      }}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
        console.log(res);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
