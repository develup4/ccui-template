import React from "react";

interface MenuCategoryProps {
  name: string;
  children: React.ReactNode;
}

export default function MenuCategory({
  name,
  children,
}: Readonly<MenuCategoryProps>) {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className="mb-4">
      <p className="font-semibold text-gray-300 mb-1">{name}</p>
      {...childrenArray}
    </div>
  );
}
