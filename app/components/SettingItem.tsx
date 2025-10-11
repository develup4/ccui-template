'use client';

import { ReactNode } from 'react';

interface SettingItemProps {
  category: string;
  name: string;
  description?: string;
  isModified?: boolean;
  children: ReactNode;
}

export default function SettingItem({
  category,
  name,
  description,
  isModified = false,
  children,
}: SettingItemProps) {
  return (
    <div className="group relative">
      {/* Left border indicator for modified state */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] transition-colors ${
          isModified ? 'bg-blue-500' : 'bg-transparent'
        }`}
      />

      <div className="pl-4 pr-3 py-3 hover:bg-overlay/50 transition-colors">
        {/* Category and name */}
        <div className="mb-1">
          <span className="text-txt/50 text-xs font-medium">{category}</span>
          <span className="text-txt/50 text-xs mx-1">›</span>
          <span className="text-txt text-sm font-medium">{name}</span>
        </div>

        {/* Description */}
        {description && (
          <div className="text-txt/60 text-xs mb-2 leading-relaxed">
            {description}
          </div>
        )}

        {/* Input/Control area */}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
