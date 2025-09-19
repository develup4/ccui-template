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
    <div className="bg-gradient-to-r from-overlay to-overlay/90 border border-bd rounded-xl shadow-md">
      <div className="p-4">
        <h3 className="text-sm font-bold flex items-center gap-3 text-txt mb-4">
          <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.586V5L8 4z" />
            </svg>
          </div>
          Model Configuration
        </h3>

        <div className="space-y-3">
          <div className="bg-background/50 rounded-lg p-3 border border-bd/50">
            <label className="text-xs font-medium text-txt/70 block mb-2">Version:</label>
            <select
              value={selectedVersion}
              onChange={(e) => onVersionChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-bd rounded-lg text-txt focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
            >
              {availableVersions.map(version => (
                <option key={version} value={version}>v{version}</option>
              ))}
            </select>
          </div>

          <div className="bg-background/50 rounded-lg p-3 border border-bd/50">
            <span className="text-xs font-medium text-txt/70 block mb-2">Model Type:</span>
            <div className="inline-flex items-center px-3 py-1.5 text-sm border border-bd/50 rounded-lg text-txt bg-gradient-to-r from-background to-background/80 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {modelType}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}