"use client";

import { FaceSmileIcon } from '@heroicons/react/24/outline';
import React, { useState, useRef } from 'react';

type ImageUploaderProps = {
  // Callback function to pass the base64 image string to the parent
  onImageUpload: (imageData: string | null) => void;
};

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // This function is called when a user selects a file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Use FileReader to get a base64 string for the parent component
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        onImageUpload(base64String); // Pass the data to the parent
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      onImageUpload(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
     <div className="flex w-full flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center shadow-sm md:w-2/5">

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />

      <div className="mt-4 flex h-48 w-48 items-center justify-center rounded-md bg-gray-100">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Image preview"
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <FaceSmileIcon className="h-16 w-16 text-gray-400" />
        )}
      </div>

      <button
        onClick={handleUploadClick}
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 cursor-pointer"
      >
        Choose a File
      </button>
    </div>
  );
};