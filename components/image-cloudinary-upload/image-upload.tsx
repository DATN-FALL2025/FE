"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadOneProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string | null;
  onRemove: (value: string) => void;
}
export const ImageUploadOne: React.FC<ImageUploadOneProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isImageMounted, setIsImageMounted] = useState(false);

  useEffect(() => {
    setIsImageMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };
  if (!isImageMounted) {
    return null;
  }
  return (
    <div>
      {value && (
        <div className="mb-4 flex items-center gap-4">
          <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(value)}
                variant="action"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={value} />
          </div>
        </div>
      )}
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset={`qod41b9g`}
        options={{
          showPoweredBy: false,
          maxFiles: 1,
          multiple: false,
          showAdvancedOptions: false,
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled || !!value}
              variant="action"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Cập nhật hình ảnh
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};
