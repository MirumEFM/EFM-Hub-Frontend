import React from "react";

export const Button = ({ children }: { children: string }) => {
  return (
    <button
      className="py-2 px-4 border border-gray-700  bg-transparent text-gray-700 hover:text-white hover:bg-gray-700 hover:shadow-md transition-all duration-125 ease-in-out select-none"
      type="submit"
    >
      {children}
    </button>
  );
};
