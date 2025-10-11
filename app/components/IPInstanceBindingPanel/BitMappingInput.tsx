'use client';

import { useState } from 'react';
import BitChip from './BitChip';

interface BitMappingInputProps {
  values: { value: number }[];
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export default function BitMappingInput({
  values,
  onAdd,
  onChange,
  onRemove,
}: BitMappingInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() !== '') {
      onAdd();
      // Update the newly added item with the input value
      setTimeout(() => {
        onChange(values.length, inputValue);
        setInputValue('');
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      {/* Display chips */}
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {values.map((item, index) => (
          <BitChip
            key={index}
            value={item.value}
            index={index}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Add new bit */}
      <div className="flex gap-2">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter bit index"
          className="flex-1 px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg text-blue-400 text-sm font-medium"
        >
          Add
        </button>
      </div>
    </div>
  );
}
