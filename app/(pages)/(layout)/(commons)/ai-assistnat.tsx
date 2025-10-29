"use client";

import Finder from "@/app/(commons)/themes/styles/svg/finder";

export default function AiAssitant() {
  return (
    <label className="input w-48 h-3/5 hover:w-96 focus-within:w-96 transition-all duration-100 md:flex hidden focus-within:transition-none focus-within:outline-none bg-background border border-background shadow-none focus-within:shadow-none -mr-5">
      <Finder />
      <input
        type="search"
        className="grow text-xs text-right hover:text-left focus-within:text-left"
        placeholder="Ask me anything✨️"
        onKeyDown={(e) => {}}
      />
    </label>
  );
}
