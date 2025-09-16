import React from 'react';
import Image from 'next/image';

interface ImageSelectorProps {
  images: string[];
  onSelect: (image: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ images, onSelect }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-2 border rounded-lg">
      {images.map((image) => (
        <div key={image} className="cursor-pointer relative aspect-square" onClick={() => onSelect(image)}>
          <Image src={image} alt={image} layout="fill" className="rounded-lg object-cover" />
        </div>
      ))}
    </div>
  );
};

export default ImageSelector;