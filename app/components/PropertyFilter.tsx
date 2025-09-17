'use client';

interface PropertyFilterProps {
  selectedTag: 'all' | 'sim' | 'hw';
  onTagChange: (tag: 'all' | 'sim' | 'hw') => void;
  propertyCount: number;
}

export default function PropertyFilter({
  selectedTag,
  onTagChange,
  propertyCount
}: PropertyFilterProps) {
  return (
    <div className="bg-overlay border border-bd rounded-lg shadow-sm">
      <div className="p-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-txt mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Property Filter
          <div className="px-2 py-1 text-xs bg-highlight text-white rounded-full ml-auto">
            {propertyCount}
          </div>
        </h3>

        <div className="flex gap-1">
          <button
            onClick={() => onTagChange('all')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded border transition-colors ${
              selectedTag === 'all'
                ? 'bg-highlight text-white border-highlight'
                : 'bg-background text-txt border-bd hover:bg-gray-overlay'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onTagChange('sim')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded border transition-colors ${
              selectedTag === 'sim'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-background text-txt border-bd hover:bg-gray-overlay'
            }`}
          >
            SIM
          </button>
          <button
            onClick={() => onTagChange('hw')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded border transition-colors ${
              selectedTag === 'hw'
                ? 'bg-yellow-600 text-white border-yellow-600'
                : 'bg-background text-txt border-bd hover:bg-gray-overlay'
            }`}
          >
            HW
          </button>
        </div>
      </div>
    </div>
  );
}