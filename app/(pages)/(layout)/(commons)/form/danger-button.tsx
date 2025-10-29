import React from "react";

interface DangerButtonProps {
  children: React.ReactNode;
}

export default function DangerButton({ children }: DangerButtonProps) {
  const childrenArray = React.Children.toArray(children);
  return (
    <button className="w-48 flex justify-center items-center text-red-500 bg-gray-overlay hover:bg-red-500 hover:text-white border border-bd rounded-md py-2 mt-4">
      {childrenArray}
    </button>
  );
}
