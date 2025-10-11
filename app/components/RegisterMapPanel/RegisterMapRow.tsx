'use client';

import RegisterMapCell from './RegisterMapCell';
import { RegisterRow } from './types';

interface RegisterMapRowProps {
  row: RegisterRow;
  rowIndex: number;
  headers: (keyof RegisterRow)[];
  onCellUpdate: (rowIndex: number, field: keyof RegisterRow, value: string) => void;
}

export default function RegisterMapRow({
  row,
  rowIndex,
  headers,
  onCellUpdate,
}: RegisterMapRowProps) {
  return (
    <tr className="hover:bg-background">
      {headers.map((field) => (
        <td key={field} className="px-2 py-1 border-b border-bd">
          <RegisterMapCell
            value={row[field]}
            rowIndex={rowIndex}
            field={field}
            onUpdate={onCellUpdate}
          />
        </td>
      ))}
    </tr>
  );
}
