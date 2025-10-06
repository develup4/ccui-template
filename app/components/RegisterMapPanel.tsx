'use client';

import { useState } from 'react';

interface RegisterMapPanelProps {
  propertyKey: string;
  currentValue: any[];
  onValueChange: (value: any) => void;
}

export default function RegisterMapPanel({
  propertyKey,
  currentValue,
  onValueChange,
}: RegisterMapPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [tableData, setTableData] = useState(currentValue);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);

  // Sync with parent component's value
  useState(() => {
    setTableData(currentValue);
  }, [currentValue]);

  if (!Array.isArray(tableData)) {
    return (
      <div className="text-red-500">
        Invalid data format for RegisterMap. Expected an array.
      </div>
    );
  }

  const handleCellClick = (rowIndex: number, field: string) => {
    setEditingCell({ rowIndex, field });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, field: string) => {
    const newData = [...tableData];
    newData[rowIndex] = { ...newData[rowIndex], [field]: e.target.value };
    setTableData(newData);
  };

  const handleInputBlur = () => {
    onValueChange(tableData);
    setEditingCell(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onValueChange(tableData);
      setEditingCell(null);
    } else if (e.key === 'Escape') {
      setTableData(currentValue); // Revert changes
      setEditingCell(null);
    }
  };

  const headers = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm text-left bg-overlay border border-bd rounded focus:outline-none focus:ring-2 focus:ring-highlight"
      >
        {isOpen ? 'Hide' : 'Show'} Register Map ({tableData.length} entries)
      </button>

      {isOpen && (
        <div className="mt-2 p-2 border border-bd rounded max-h-96 overflow-y-auto">
          <table className="w-full text-sm text-left table-auto">
            <thead className="sticky top-0 bg-overlay">
              <tr>
                {headers.map(header => (
                  <th key={header} className="px-2 py-1 border-b border-bd">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-background">
                  {headers.map(field => (
                    <td key={field} className="px-2 py-1 border-b border-bd">
                      {editingCell?.rowIndex === rowIndex && editingCell?.field === field ? (
                        <input
                          type="text"
                          value={row[field]}
                          onChange={(e) => handleInputChange(e, rowIndex, field)}
                          onBlur={handleInputBlur}
                          onKeyDown={handleInputKeyDown}
                          autoFocus
                          className="w-full px-1 py-0 bg-background border border-highlight rounded outline-none"
                        />
                      ) : (
                        <div onClick={() => handleCellClick(rowIndex, field)} className="w-full h-full">
                          {row[field]}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
