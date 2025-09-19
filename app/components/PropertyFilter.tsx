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
    <div className="bg-gradient-to-r from-overlay to-overlay/90 border border-bd rounded-xl shadow-md">
      <div className="p-4">
        <h3 className="text-sm font-bold flex items-center gap-3 text-txt mb-4">
          <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          Property Filter
          <div className="px-2.5 py-1 text-xs bg-gradient-to-r from-highlight to-highlight/80 text-white rounded-full ml-auto font-bold shadow-sm">
            {propertyCount}
          </div>
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => onTagChange('all')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
              selectedTag === 'all'
                ? 'bg-gradient-to-r from-highlight to-highlight/80 text-white border-highlight shadow-md transform scale-105'
                : 'bg-background/50 text-txt border-bd/50 hover:bg-background hover:border-bd hover:shadow-sm'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onTagChange('sim')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
              selectedTag === 'sim'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-md transform scale-105'
                : 'bg-background/50 text-txt border-bd/50 hover:bg-background hover:border-bd hover:shadow-sm'
            }`}
          >
            SIM
          </button>
          <button
            onClick={() => onTagChange('hw')}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
              selectedTag === 'hw'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-500 shadow-md transform scale-105'
                : 'bg-background/50 text-txt border-bd/50 hover:bg-background hover:border-bd hover:shadow-sm'
            }`}
          >
            HW
          </button>
        </div>
      </div>
    </div>
  );
}