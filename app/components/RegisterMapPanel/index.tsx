'use client';

import { useState } from 'react';
import RegisterMapTable from './RegisterMapTable';
import { RegisterRow } from './types';

interface RegisterMapPanelProps {
  propertyKey: string;
  currentValue: RegisterRow[];
  onValueChange: (value: RegisterRow[]) => void;
}

export default function RegisterMapPanel({
  propertyKey,
  currentValue,
  onValueChange,
}: RegisterMapPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!Array.isArray(currentValue)) {
    return (
      <div className="text-red-400 text-sm">
        Invalid data format for RegisterMap. Expected an array.
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm text-left bg-overlay border border-bd rounded hover:bg-overlay/70 focus:outline-none focus:ring-2 focus:ring-blue-500 text-txt"
      >
        {isOpen ? '▼' : '▶'} Register Map ({currentValue.length} entries)
      </button>

      {isOpen && (
        <RegisterMapTable
          data={currentValue}
          onDataChange={onValueChange}
        />
      )}
    </div>
  );
}
