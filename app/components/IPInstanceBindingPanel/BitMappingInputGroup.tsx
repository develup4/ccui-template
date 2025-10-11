
interface BitMappingInputGroupProps {
  title: string;
  values: { value: number }[];
  onAdd: () => void;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export default function BitMappingInputGroup({ title, values, onAdd, onChange, onRemove }: BitMappingInputGroupProps) {
  return (
    <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-txt">{title}</span>
        <button
          onClick={onAdd}
          className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md transition-colors"
        >
          + Add
        </button>
      </div>
      <div className="space-y-2">
        {values.length === 0 ? (
          <div className="text-xs text-txt/60 text-center py-2">No mapping values</div>
        ) : (
          values.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="number"
                value={item.value}
                onChange={(e) => onChange(index, e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => onRemove(index)}
                className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
