'use client';

import { useState } from 'react';
import { RegisterRow } from './types';

interface RegisterMapCellProps {
  value: string;
  rowIndex: number;
  field: keyof RegisterRow;
  onUpdate: (rowIndex: number, field: keyof RegisterRow, value: string) => void;
}

export default function RegisterMapCell({
  value,
  rowIndex,
  field,
  onUpdate,
}: RegisterMapCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onUpdate(rowIndex, field, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full px-1 py-0 bg-background border border-blue-500 rounded outline-none text-txt"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="w-full h-full cursor-text hover:bg-overlay/50 px-1 text-txt"
    >
      {value}
    </div>
  );
}
