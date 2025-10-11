'use client';

import { ReactNode } from 'react';

interface SettingCategoryProps {
  title: string;
  children: ReactNode;
}

export default function SettingCategory({
  title,
  children,
}: SettingCategoryProps) {
  return (
    <div className="mb-6">
      {/* Category header */}
      <div className="px-4 py-2 border-b border-bd">
        <h3 className="text-txt text-xs font-bold uppercase tracking-wider">
          {title}
        </h3>
      </div>

      {/* Category items */}
      <div className="divide-y divide-bd/50">{children}</div>
    </div>
  );
}
