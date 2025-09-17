"use client";
import React from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

interface ImageUploaderProps {
  onImageSelect: (imageDataUrl: string) => void;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, id }) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        onImageSelect(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        <ArrowUpTrayIcon className="w-6 h-6" />
        <span className="font-semibold text-sm">Upload</span>
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ImageUploader;
