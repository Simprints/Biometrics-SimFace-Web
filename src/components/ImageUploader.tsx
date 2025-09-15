import { FaceSmileIcon } from '@heroicons/react/24/outline';
import React, { useState, useRef } from 'react';

type ImageUploaderProps = {
  title: string;
};

const ImageUploader = ({ title }: ImageUploaderProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // This function is called when a user selects a file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex w-full flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center shadow-sm md:w-2/5">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>

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
        className="mt-4 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 cursor-pointer"
      >
        Upload Image
      </button>

      <p className="my-2 text-sm text-gray-500">or</p>

      <button className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
        Select from Bank
      </button>
    </div>
  );
};

export default ImageUploader;