'use client';

import { useSelection } from '../contexts/SelectionContext';

export default function IPInstancePortPanel() {
  const { selectedPort, setSelectedPort } = useSelection();

  if (!selectedPort) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50 text-txt">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2 text-txt">Port Properties Panel</h2>
          <p className="text-txt/60 text-sm">Select a port to view and edit its properties</p>
        </div>
      </div>
    );
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
    <div className="w-full h-full p-3 bg-background overflow-y-auto">
      <div className="space-y-3">
        {/* Port Information */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-bd rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-txt">Port Properties</h1>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-txt/60 font-medium">Instance:</span>
              <span className="text-txt font-mono">{selectedPort.instanceId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-txt/60 font-medium">Port:</span>
              <span className="text-txt font-mono font-semibold">{selectedPort.portName}</span>
            </div>
          </div>
        </div>

        {/* Properties Header */}
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

        {/* Mapping Section */}
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
      </div>
    </div>
  );
}
