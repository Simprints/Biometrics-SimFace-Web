import React from 'react';

type ImageUploaderProps = {
  title: string;
};

const ImageUploader = ({ title }: ImageUploaderProps) => {
  // TODO: Add state and logic to handle file uploads and display a preview
  return (
    <div className="flex w-full flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center shadow-sm md:w-2/5">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <div className="mt-4 flex h-48 w-48 items-center justify-center rounded-md bg-gray-100">
        <span className="text-gray-400">Image Preview</span>
      </div>
      <button className="mt-4 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300">
        Upload Image
      </button>
      <p className="my-2 text-sm text-gray-500">or</p>
      <button className="text-sm font-medium text-blue-600 hover:underline">
        Select from Bank
      </button>
    </div>
  );
};

export default ImageUploader;