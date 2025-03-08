import React from "react";

interface CdButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const CdButton: React.FC<CdButtonProps> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default CdButton;
