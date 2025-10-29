"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

interface ADLoginRedirectPageProps {
  searchParams: { redirectUrl: string };
}

export default function ADLoginRedirectPage({
  searchParams: { redirectUrl },
}: ADLoginRedirectPageProps) {
  const router = useRouter();

  const finalRedirectUrl =
    redirectUrl === null || redirectUrl === undefined || redirectUrl === ""
      ? "/explorer/projects"
      : decodeURIComponent(redirectUrl);

  // Redirect
  useEffect(() => {
    const timer = setTimeout(() => router.push(finalRedirectUrl), 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-background bg-gradient text-txt">
      <p className="text-2xl">We are logging you in.</p>
      <p className="text-sm text-gray-400 mb-6">Don't refresh the page.</p>
      <span className="loading loading-spinner"></span>
    </div>
  );
}
