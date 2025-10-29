"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItemProps {
  name: string;
  IconComponent: React.FC<any>;
  to: string;
  newWindow?: boolean;
}

export default function MenuItem({
  name,
  IconComponent,
  to,
  newWindow = false,
}: MenuItemProps) {
  const hit = usePathname() === to;

  return (
    <Link href={to} target={newWindow ? "_blank" : "_self"}>
      <div
        className={`h-8 flex items-center rounded-md p-2 mb-1 ${
          hit
            ? "bg-gray-overlay hover:cursor-default"
            : "hover:border border-highlight"
        }`}
      >
        <IconComponent className="size-4 mr-1" />
        <p className="text-sm text-gray-300">{name}</p>
      </div>
    </Link>
  );
}
