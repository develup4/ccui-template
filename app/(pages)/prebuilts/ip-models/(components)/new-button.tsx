"use client";

import { FaPlus } from "react-icons/fa6";
import { createIpModel } from "./actions";

export default function NewIPModelButton() {
  return (
    <div
      onClick={() => createIpModel()}
      className="flex items-center cursor-pointer hover:text-highlight *:hover:stroke-highlight animate-pulse hover:animate-none hover:font-bold"
    >
      <FaPlus className="mr-1 fill-txt" />
      <p className="text-sm text-txt">Create New Model</p>
    </div>
  );
}
