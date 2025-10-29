import LeftPanel from "@/app/(home)/left";
import React from "react";

export default function AccountsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-background text-txt">
      <LeftPanel isAccountPage />
      <div className="h-screen relative flex items-center">
        <div className="w-full mx-auto max-w-7xl px-6 lg:flex lg:px-8">
          <div className="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
            <div className="mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto typography">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
