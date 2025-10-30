"use client";

import Breadcrumb, { BreadcrumbItem } from "@layout/(commons)/breadcrumb";
import { usePathname } from "next/navigation";

export default function UrlBreadcrumb() {
  const urlChunks = usePathname()
    .split("/")
    .filter((chunk) => chunk.length > 0);

  const breadcrumbItems: BreadcrumbItem[] = urlChunks.map((chunk, index) => ({
    name: chunk.replaceAll("-", " ").replace(/^[0-9]+/, ""),
    link: "/" + urlChunks.slice(0, index + 1).join("/"),
  }));

  return <Breadcrumb items={breadcrumbItems} />;
}
