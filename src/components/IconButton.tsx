import React from "react";

interface IconButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  text: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, text }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 cursor-pointer transition-colors w-full"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default IconButton;
