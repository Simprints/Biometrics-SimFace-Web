import React from "react";
import Image from "next/image";

interface ImageSelectorProps {
  images: string[];
  onSelect: (image: string) => void;
  trueMatch: string | null;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  images,
  onSelect,
  trueMatch,
}) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto p-2 border rounded-lg">
      {images.map((image) => {
        const isTrueMatch = image === trueMatch;
        let borderClass = "border-transparent";
        if (isTrueMatch) {
          borderClass = "ring ring-3 ring-green-400";
        }
        return (
          <div
            key={image}
            className={`cursor-pointer relative aspect-square ${borderClass} rounded-lg overflow-hidden`}
            onClick={() => onSelect(image)}
          >
            <Image
              src={image}
              alt={image}
              layout="fill"
              className="rounded-lg object-cover"
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImageSelector;
