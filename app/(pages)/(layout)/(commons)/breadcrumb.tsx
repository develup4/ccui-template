"use client";

import Link from "next/link";

export interface BreadcrumbItem {
  name: string;
  link?: string;
  action?: Function;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="breadcrumbs sm:block hidden bg-gray-overlay font-bold text-xs rounded-lg ml-4 px-4 py-2">
      <ul>
        {items.map((item, index) => (
          <li className="hover:text-highlight" key={index}>
            {item.link ? (
              <Link href={item.link} key={index}>
                {item.name.toUpperCase()}
              </Link>
            ) : (
              <p onClick={() => item.action ?? (() => {})}>
                {item.name.toUpperCase()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
