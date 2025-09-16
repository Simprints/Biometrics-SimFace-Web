'use client';
import React from 'react';

interface ImageUploaderProps {
  onImageSelect: (imageDataUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
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
        <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
    </div>
  );
};

export default ImageUploader;