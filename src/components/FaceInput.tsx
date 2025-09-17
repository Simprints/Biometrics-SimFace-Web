// src/components/FaceInput.tsx
"use client";

import React from "react";
import {
  FaceSmileIcon,
  PhotoIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import ImageUploader from "@/components/ImageUploader";
import IconButton from "@/components/IconButton";

interface FaceInputProps {
  title: string;
  imageSrc: string | null;
  imageRef: React.RefObject<HTMLImageElement | null>;
  onImageSelect: (image: string) => void;
  onGalleryClick: () => void;
  hasGallery: boolean;
  uploaderId: string;
  error?: string | null;
}

const FaceInput: React.FC<FaceInputProps> = ({
  title,
  imageSrc,
  imageRef,
  onImageSelect,
  onGalleryClick,
  hasGallery,
  uploaderId,
  error,
}) => {
  return (
    <div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-500">{title}</h2>
        <div className="space-y-3">
          <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg mb-6 relative">
            {imageSrc ? (
              <img
                ref={imageRef}
                src={imageSrc}
                alt={`Face for comparison ${title}`}
                className="rounded-lg aspect-square object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <FaceSmileIcon className="w-20 bg-gray-100 text-gray-300" />
            )}
          </div>

          {hasGallery && (
            <IconButton
              onClick={onGalleryClick}
              icon={<PhotoIcon className="w-6 h-6" />}
              text="Gallery"
            />
          )}

          {hasGallery && (
            <div className="relative flex items-center mx-5">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
          )}

          <ImageUploader onImageSelect={onImageSelect} id={uploaderId} />
        </div>
      </div>
      {error && (
        <div className="flex items-center text-red-500 text-sm my-4">
          <ExclamationCircleIcon className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FaceInput;
