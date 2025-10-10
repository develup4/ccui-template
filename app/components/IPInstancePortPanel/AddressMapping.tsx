'use client';

import { useSelection } from '../../contexts/SelectionContext';

export default function AddressMapping() {
    const { selectedPort, setSelectedPort } = useSelection();

    if (!selectedPort) {
        return null;
    }

    const properties = selectedPort.properties || {};

    const handleMappingChange = (field: 'base' | 'size' | 'remap' | 'add_offset', value: string) => {
        const currentMapping = properties.mapping?.value || {
            base: { value: '' },
            size: { value: '' },
            remap: { value: '' },
            add_offset: { value: '' },
            remove_offset: { value: false }
        };

        const updatedPort = {
            ...selectedPort,
            properties: {
                ...properties,
                mapping: {
                    value: {
                        ...currentMapping,
                        [field]: { value }
                    }
                }
            }
        };

        setSelectedPort(updatedPort);
    };

    const handleRemoveOffsetChange = (value: boolean) => {
        const currentMapping = properties.mapping?.value || {
            base: { value: '' },
            size: { value: '' },
            remap: { value: '' },
            add_offset: { value: '' },
            remove_offset: { value: false }
        };

        const updatedPort = {
            ...selectedPort,
            properties: {
                ...properties,
                mapping: {
                    value: {
                        ...currentMapping,
                        remove_offset: { value }
                    }
                }
            }
        };

        setSelectedPort(updatedPort);
    };

    const handleMappingToggle = (enabled: boolean) => {
        const updatedPort = {
            ...selectedPort,
            properties: enabled ? {
                ...properties,
                mapping: {
                    value: {
                        base: { value: '' },
                        size: { value: '' },
                        remap: { value: '' },
                        add_offset: { value: '' },
                        remove_offset: { value: false }
                    }
                }
            } : Object.fromEntries(
                Object.entries(properties).filter(([key]) => key !== 'mapping')
            )
        };

        setSelectedPort(updatedPort);
    };

    return (
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-bd rounded-xl shadow-md">
            <div className="flex items-center gap-3 p-4 border-b border-bd">
                <input
                    type="checkbox"
                    checked={properties.mapping !== undefined}
                    onChange={(e) => handleMappingToggle(e.target.checked)}
                    className="w-4 h-4 rounded border-bd bg-background text-purple-600 focus:ring-2 focus:ring-purple-500"
                />
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                </div>
                <h2 className="text-lg font-bold text-txt">Address Mapping</h2>
            </div>

            {properties.mapping !== undefined && (
                <div className="p-4 space-y-3">
                    {/* Base */}
                    <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
                        <label className="block">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-txt">Base Address</span>
                            </div>
                            <input
                                type="text"
                                value={properties.mapping?.value?.base?.value ?? ''}
                                onChange={(e) => handleMappingChange('base', e.target.value)}
                                placeholder="0x00000000"
                                className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </label>
                    </div>

                    {/* Size */}
                    <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
                        <label className="block">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-txt">Mapping Size</span>
                            </div>
                            <input
                                type="text"
                                value={properties.mapping?.value?.size?.value ?? ''}
                                onChange={(e) => handleMappingChange('size', e.target.value)}
                                placeholder="0x1000"
                                className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </label>
                    </div>

                    {/* Remap */}
                    <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
                        <label className="block">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-txt">Remap Address</span>
                            </div>
                            <input
                                type="text"
                                value={properties.mapping?.value?.remap?.value ?? ''}
                                onChange={(e) => handleMappingChange('remap', e.target.value)}
                                placeholder="0x00000000"
                                className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </label>
                    </div>

                    {/* Add Offset */}
                    <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
                        <label className="block">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-txt">Add Offset</span>
                            </div>
                            <input
                                type="text"
                                value={properties.mapping?.value?.add_offset?.value ?? ''}
                                onChange={(e) => handleMappingChange('add_offset', e.target.value)}
                                placeholder="0x0"
                                className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </label>
                    </div>

                    {/* Remove Offset */}
                    <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={properties.mapping?.value?.remove_offset?.value ?? false}
                                onChange={(e) => handleRemoveOffsetChange(e.target.checked)}
                                className="w-4 h-4 rounded border-bd bg-background text-purple-600 focus:ring-2 focus:ring-purple-500"
                            />
                            <div className="flex-1">
                                <div className="text-sm font-medium text-txt">Remove Offset</div>
                                <div className="text-xs text-txt/60">Remove offset from address mapping</div>
                            </div>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}
