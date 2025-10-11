'use client';

import RegisterMapRow from './RegisterMapRow';
import { RegisterRow } from './types';

interface RegisterMapTableProps {
  data: RegisterRow[];
  onDataChange: (data: RegisterRow[]) => void;
}

export default function RegisterMapTable({
  data,
  onDataChange,
}: RegisterMapTableProps) {
  const headers = data.length > 0 ? (Object.keys(data[0]) as (keyof RegisterRow)[]) : [];

  const handleCellUpdate = (rowIndex: number, field: keyof RegisterRow, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    onDataChange(newData);
  };

  if (data.length === 0) {
    return (
      <div className="text-txt/60 text-sm text-center py-4">
        No register map data
      </div>
    );
  }

  return (
    <div className="mt-2 p-2 border border-bd rounded max-h-96 overflow-y-auto bg-overlay">
      <table className="w-full text-sm text-left table-auto">
        <thead className="sticky top-0 bg-overlay">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-2 py-1 border-b border-bd text-txt font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <RegisterMapRow
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              headers={headers}
              onCellUpdate={handleCellUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
