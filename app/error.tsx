"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-background bg-gradient">
      <div>
        <p className="font-extrabold text-4xl text-white mb-2">!!</p>
        <p className="text-2xl text-gray-300">Something went wrong</p>
        <p className="text-2xl text-gray-300 mb-3">in this Page.</p>
        <p className="w-3/5 text-sm text-red-500 mb-5">
          {error?.message ?? "Unknown error"}
        </p>
        <Link href="/">
          <button className="w-40 h-8 border border-sky-500 rounded-lg animate-pulse hover:animate-none hover:bg-sky-500 text-xs text-white">
            Back to home
          </button>
        </Link>
      </div>
    </div>
  );
}
