'use client';

interface ModelVersionSelectorProps {
  availableVersions: string[];
  selectedVersion: string;
  modelType: string;
  onVersionChange: (version: string) => void;
}

export default function ModelVersionSelector({
  availableVersions,
  selectedVersion,
  modelType,
  onVersionChange
}: ModelVersionSelectorProps) {
  return (
    <div className="bg-overlay border border-bd rounded-lg shadow-sm">
      <div className="p-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-txt mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.586V5L8 4z" />
          </svg>
          Model Version
        </h3>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-txt">Version:</label>
            <select
              value={selectedVersion}
              onChange={(e) => onVersionChange(e.target.value)}
              className="flex-1 px-3 py-1 text-xs bg-background border border-bd rounded text-txt focus:outline-none focus:ring-2 focus:ring-highlight"
            >
              {availableVersions.map(version => (
                <option key={version} value={version}>{version}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-txt">Model:</span>
            <div className="px-2 py-1 text-xs border border-bd rounded text-txt bg-background">
              {modelType}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}