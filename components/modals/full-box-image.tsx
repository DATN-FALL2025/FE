"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { CldImage } from "next-cloudinary";

interface ImageLightboxProps {
  src: string;
  alt: string;
}

const ImageLightbox = ({ src, alt }: ImageLightboxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = () => {
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="cursor-pointer" onClick={openLightbox}>
        <CldImage
          src={src}
          width={150}
          height={150}
          alt={alt}
          className="object-cover w-96 h-48 hover:scale-105 transition-transform duration-200"
        />
      </div>
      <Dialog open={isOpen} onOpenChange={closeLightbox}>
        <DialogOverlay className="fixed inset-0 bg-black/70 z-50" />
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[90vh] p-0 overflow-hidden bg-transparent">
          <div className="w-full h-full flex items-center justify-center">
            <CldImage
              src={src}
              width={1200}
              height={800}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageLightbox;
