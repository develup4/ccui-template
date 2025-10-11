'use client';

import { useState } from 'react';

interface BitChipProps {
  value: number;
  index: number;
  onRemove: (index: number) => void;
}

export default function BitChip({ value, index, onRemove }: BitChipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 border border-blue-600/50 rounded text-blue-400 text-xs font-mono hover:bg-blue-600/30 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{value}</span>
      {isHovered && (
        <button
          onClick={() => onRemove(index)}
          className="ml-1 text-red-400 hover:text-red-300 font-bold leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
