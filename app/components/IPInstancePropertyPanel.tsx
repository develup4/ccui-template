'use client';

import { useState, useEffect } from 'react';
import { IPInstance } from '../sample-data';
import PropertyInput from './PropertyInput';
import ModelVersionSelector from './ModelVersionSelector';
import PropertyFilter from './PropertyFilter';
import InstanceInfo from './InstanceInfo';

interface IPInstancePropertyPanelProps {
  selectedInstance: IPInstance | null;
  onUpdate?: (updatedInstance: IPInstance) => void;
}

export default function IPInstancePropertyPanel({ selectedInstance, onUpdate }: IPInstancePropertyPanelProps) {
  const [selectedTag, setSelectedTag] = useState<'all' | 'sim' | 'hw'>('all');
  const [rangedProperties, setRangedProperties] = useState<Set<string>>(new Set());
  const [availableVersions, setAvailableVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  useEffect(() => {
    if (selectedInstance) {
      const versions = Object.keys(selectedInstance.model.data);
      setAvailableVersions(versions);
      setSelectedVersion(selectedInstance.modelVersion);
    }
  }, [selectedInstance]);

  if (!selectedInstance) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50 text-txt">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2 text-txt">Properties Panel</h2>
          <p className="text-txt/60 text-sm">Select an IPInstance to view and edit its properties</p>
        </div>
      </div>
    );
  }

  const currentVersionData = selectedInstance.model.data[selectedVersion];
  const properties = currentVersionData?.properties || {};
  const instanceProperties = selectedInstance.data?.properties || {};

  const filteredProperties = Object.entries(properties).filter(([_, propData]: [string, any]) => {
    if (selectedTag === 'all') return true;
    return propData.tag === selectedTag;
  });

  const handlePropertyChange = (propertyKey: string, newValue: any) => {
    if (!selectedInstance || !onUpdate) return;

    const updatedInstance = {
      ...selectedInstance,
      data: {
        ...selectedInstance.data,
        properties: {
          ...instanceProperties,
          [propertyKey]: newValue
        }
      }
    };

    onUpdate(updatedInstance);
  };

  const handleVersionChange = (newVersion: string) => {
    if (!selectedInstance || !onUpdate) return;

    const updatedInstance = {
      ...selectedInstance,
      modelVersion: newVersion
    };

    setSelectedVersion(newVersion);
    onUpdate(updatedInstance);
  };

  const handleRangedPropertyChange = (propertyKey: string, isRanged: boolean) => {
    const newRangedProperties = new Set(rangedProperties);
    if (isRanged) {
      newRangedProperties.add(propertyKey);
    } else {
      newRangedProperties.delete(propertyKey);
    }
    setRangedProperties(newRangedProperties);
  };

  return (
    <div className="w-full h-full p-3 bg-background overflow-y-auto">
      <div className="space-y-3">
        {/* Instance Information - 상단으로 이동 */}
        <InstanceInfo
          instance={selectedInstance}
          rangedPropertiesCount={rangedProperties.size}
          onUpdate={onUpdate}
        />

        {/* Model Version Selector */}
        <ModelVersionSelector
          availableVersions={availableVersions}
          selectedVersion={selectedVersion}
          modelType={selectedInstance.model.type}
          onVersionChange={handleVersionChange}
        />

        {/* Property Filter */}
        <PropertyFilter
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          propertyCount={filteredProperties.length}
        />

        {/* Properties Header */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-bd rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-txt">Properties</h1>
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-txt/70 font-medium">Live Configuration</span>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="space-y-2">
          {filteredProperties.length === 0 ? (
            <div className="bg-overlay border border-bd rounded-lg shadow-sm">
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-2 opacity-50 text-txt">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-txt/60 text-sm">No properties available for the selected filter</p>
              </div>
            </div>
          ) : (
            filteredProperties.map(([propertyKey, propertyData]: [string, any]) => {
              const currentValue = instanceProperties[propertyKey];
              const isModified = currentValue !== undefined && currentValue !== propertyData.defaultValue;
              const isRanged = rangedProperties.has(propertyKey);

              return (
                <PropertyInput
                  key={propertyKey}
                  propertyKey={propertyKey}
                  propertyData={propertyData}
                  currentValue={currentValue !== undefined ? currentValue : propertyData.defaultValue}
                  isModified={isModified}
                  isRanged={isRanged}
                  onValueChange={(value) => handlePropertyChange(propertyKey, value)}
                  onRangedChange={(ranged) => handleRangedPropertyChange(propertyKey, ranged)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}