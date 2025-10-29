import React from "react";

interface ManuLayoutProps {
  children: React.ReactNode;
}

export default function MenuLayout({ children }: Readonly<ManuLayoutProps>) {
  const childrenArray = React.Children.toArray(children);
  return <div className="size-full pr-8">{...childrenArray}</div>;
}
