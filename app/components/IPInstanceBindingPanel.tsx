'use client';

import { useState } from 'react';

interface IPInstanceBinding {
  from: string;
  to: string;
  properties?: {
    mapping?: {
      value: {
        from?: {
          value: {
            value: number;
          }[]
        };
        to?: {
          value: {
            value: number;
          }[]
        }
      }
    };
    crossing?: {
      value: {
        type: { value: "sync" | "async" };
        fifo_size: { value: number };
        direction: { value: "from" | "none" };
        source_sync: { value: number };
        sink_sync: { value: number };
      }
    }
  };
}

interface IPInstanceBindingPanelProps {
  selectedBinding: IPInstanceBinding | null;
  onUpdate?: (updatedBinding: IPInstanceBinding) => void;
}

export default function IPInstanceBindingPanel({ selectedBinding, onUpdate }: IPInstanceBindingPanelProps) {
  if (!selectedBinding) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50 text-txt">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2 text-txt">Binding Properties Panel</h2>
          <p className="text-txt/60 text-sm">Select a connection to view and edit its properties</p>
        </div>
      </div>
    );
  }

  const properties = selectedBinding.properties || {};

  const handleMappingFromAdd = () => {
    if (!onUpdate) return;

    const currentFrom = properties.mapping?.value?.from?.value || [];
    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties.mapping?.value,
            from: {
              value: [...currentFrom, { value: 0 }]
            }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleMappingFromChange = (index: number, value: string) => {
    if (!onUpdate) return;

    const currentFrom = properties.mapping?.value?.from?.value || [];
    const newFrom = [...currentFrom];
    newFrom[index] = { value: parseInt(value) || 0 };

    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties.mapping?.value,
            from: { value: newFrom }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleMappingFromRemove = (index: number) => {
    if (!onUpdate) return;

    const currentFrom = properties.mapping?.value?.from?.value || [];
    const newFrom = currentFrom.filter((_, i) => i !== index);

    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties.mapping?.value,
            from: { value: newFrom }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleMappingToAdd = () => {
    if (!onUpdate) return;

    const currentTo = properties.mapping?.value?.to?.value || [];
    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties.mapping?.value,
            to: {
              value: [...currentTo, { value: 0 }]
            }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleMappingToChange = (index: number, value: string) => {
    if (!onUpdate) return;

    const currentTo = properties.mapping?.value?.to?.value || [];
    const newTo = [...currentTo];
    newTo[index] = { value: parseInt(value) || 0 };

    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties.mapping?.value,
            to: { value: newTo }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleMappingToRemove = (index: number) => {
    if (!onUpdate) return;

    const currentTo = properties.mapping?.value?.to?.value || [];
    const newTo = currentTo.filter((_, i) => i !== index);

    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties.mapping?.value,
            to: { value: newTo }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleCrossingChange = (field: 'type' | 'fifo_size' | 'direction' | 'source_sync' | 'sink_sync', value: any) => {
    if (!onUpdate) return;

    const currentCrossing = properties.crossing?.value || {
      type: { value: 'sync' as const },
      fifo_size: { value: 0 },
      direction: { value: 'none' as const },
      source_sync: { value: 0 },
      sink_sync: { value: 0 }
    };

    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        crossing: {
          value: {
            ...currentCrossing,
            [field]: { value }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const mappingFromValues = properties.mapping?.value?.from?.value || [];
  const mappingToValues = properties.mapping?.value?.to?.value || [];
  const crossing = properties.crossing?.value;

  return (
    <div className="w-full h-full p-3 bg-background overflow-y-auto">
      <div className="space-y-3">
        {/* Binding Information */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-bd rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-txt">Binding Properties</h1>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-txt/60 font-medium">From:</span>
              <span className="text-txt font-mono">{selectedBinding.from}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-txt/60 font-medium">To:</span>
              <span className="text-txt font-mono">{selectedBinding.to}</span>
            </div>
          </div>
        </div>

        {/* Mapping Section */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-bd rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-txt">Bit Mapping</h2>
          </div>

          <div className="space-y-4">
            {/* From Mapping */}
            <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-txt">From Bits</span>
                <button
                  onClick={handleMappingFromAdd}
                  className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md transition-colors"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {mappingFromValues.length === 0 ? (
                  <div className="text-xs text-txt/60 text-center py-2">No mapping values</div>
                ) : (
                  mappingFromValues.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => handleMappingFromChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => handleMappingFromRemove(index)}
                        className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* To Mapping */}
            <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-txt">To Bits</span>
                <button
                  onClick={handleMappingToAdd}
                  className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md transition-colors"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {mappingToValues.length === 0 ? (
                  <div className="text-xs text-txt/60 text-center py-2">No mapping values</div>
                ) : (
                  mappingToValues.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => handleMappingToChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => handleMappingToRemove(index)}
                        className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Crossing Section */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-bd rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-txt">Clock Domain Crossing</h2>
          </div>

          <div className="space-y-3">
            {/* Type */}
            <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-txt">Type</span>
                </div>
                <select
                  value={crossing?.type?.value ?? 'sync'}
                  onChange={(e) => handleCrossingChange('type', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="sync">Sync</option>
                  <option value="async">Async</option>
                </select>
              </label>
            </div>

            {/* FIFO Size */}
            <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-txt">FIFO Size</span>
                </div>
                <input
                  type="number"
                  value={crossing?.fifo_size?.value ?? 0}
                  onChange={(e) => handleCrossingChange('fifo_size', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </label>
            </div>

            {/* Direction */}
            <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-txt">Direction</span>
                </div>
                <select
                  value={crossing?.direction?.value ?? 'none'}
                  onChange={(e) => handleCrossingChange('direction', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="from">From</option>
                  <option value="none">None</option>
                </select>
              </label>
            </div>

            {/* Source Sync */}
            <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-txt">Source Sync</span>
                </div>
                <input
                  type="number"
                  value={crossing?.source_sync?.value ?? 0}
                  onChange={(e) => handleCrossingChange('source_sync', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </label>
            </div>

            {/* Sink Sync */}
            <div className="bg-background/50 border border-bd/50 rounded-lg p-3">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-txt">Sink Sync</span>
                </div>
                <input
                  type="number"
                  value={crossing?.sink_sync?.value ?? 0}
                  onChange={(e) => handleCrossingChange('sink_sync', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
