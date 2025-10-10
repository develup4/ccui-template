'use client';

import { useSelection } from '../../contexts/SelectionContext';

export default function PortConfiguration() {
    const { selectedPort, setSelectedPort } = useSelection();

    if (!selectedPort) {
        return null;
    }

    const properties = selectedPort.properties || {};

    const handleSizeToggle = (enabled: boolean) => {
        const updatedPort = {
            ...selectedPort,
            properties: {
                ...properties,
                size: enabled ? 0 : undefined
            }
        };

        setSelectedPort(updatedPort);
    };

    const handleSizeChange = (value: string) => {
        const numValue = value === '' ? 0 : parseInt(value);
        const updatedPort = {
            ...selectedPort,
            properties: {
                ...properties,
                size: numValue
            }
        };

        setSelectedPort(updatedPort);
    };

    const handleBypassMappingToggle = (enabled: boolean) => {
        const updatedPort = {
            ...selectedPort,
            properties: enabled ? {
                ...properties,
                bypass_mapping: false
            } : Object.fromEntries(
                Object.entries(properties).filter(([key]) => key !== 'bypass_mapping')
            )
        };

        setSelectedPort(updatedPort);
    };

    const handleBypassMappingChange = (value: boolean) => {
        const updatedPort = {
            ...selectedPort,
            properties: {
                ...properties,
                bypass_mapping: value
            }
        };

        setSelectedPort(updatedPort);
    };

    return (
        <>
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-bd rounded-xl p-4 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                    </div>
                    <h1 className="text-lg font-bold text-txt">Configuration</h1>
                </div>
            </div>

            {/* Size */}
            <div className="bg-overlay border border-bd rounded-lg shadow-sm">
                <div className="p-3 border-b border-bd flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={properties.size !== undefined}
                        onChange={(e) => handleSizeToggle(e.target.checked)}
                        className="w-4 h-4 rounded border-bd bg-background text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-txt">Size</span>
                </div>
                {properties.size !== undefined && (
                    <div className="p-3">
                        <input
                            type="number"
                            value={properties.size ?? 0}
                            onChange={(e) => handleSizeChange(e.target.value)}
                            placeholder="Enter size"
                            className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}
            </div>

            {/* Bypass Mapping */}
            <div className="bg-overlay border border-bd rounded-lg shadow-sm">
                <div className="p-3 border-b border-bd flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={'bypass_mapping' in properties}
                        onChange={(e) => handleBypassMappingToggle(e.target.checked)}
                        className="w-4 h-4 rounded border-bd bg-background text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-txt">Bypass Mapping</span>
                </div>
                {'bypass_mapping' in properties && (
                    <div className="p-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={properties.bypass_mapping ?? false}
                                onChange={(e) => handleBypassMappingChange(e.target.checked)}
                                className="w-4 h-4 rounded border-bd bg-background text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                                <div className="text-sm text-txt">Enable bypass</div>
                                <div className="text-xs text-txt/60">Skip address mapping for this port</div>
                            </div>
                        </label>
                    </div>
                )}
            </div>
        </>
    );
}
