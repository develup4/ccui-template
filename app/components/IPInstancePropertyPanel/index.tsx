'use client';

import { useState, useEffect } from 'react';
import { useExplorer } from '../../contexts/ExplorerContext';
import PropertyList from './PropertyList';
import ModelVersionSelector from '../ModelVersionSelector';
import PropertyFilter from '../PropertyFilter';
import InstanceInfo from '../InstanceInfo';

export default function IPInstancePropertyPanel() {
  const { selectedNode, setSelectedNode } = useExplorer();
  const [selectedTag, setSelectedTag] = useState<'all' | 'sim' | 'hw'>('all');
  const [rangedProperties, setRangedProperties] = useState<Set<string>>(new Set());
  const [availableVersions, setAvailableVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  useEffect(() => {
    if (selectedNode) {
      const versions = Object.keys(selectedNode.model.data);
      setAvailableVersions(versions);
      setSelectedVersion(selectedNode.modelVersion);
    }
  }, [selectedNode]);

  if (!selectedNode) {
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

  const currentVersionData = selectedNode.model.data[selectedVersion];
  const properties = currentVersionData?.properties || {};
  const instanceProperties = selectedNode.data?.properties || {};

  const filteredProperties = Object.entries(properties).filter(([_, propData]: [string, any]) => {
    if (selectedTag === 'all') return true;
    return propData.tag === selectedTag;
  });

  const handlePropertyChange = (propertyKey: string, newValue: any) => {
    if (!selectedNode) return;

    // Direct mutation for optimistic update
    selectedNode.data.properties[propertyKey] = newValue;

    // Trigger re-render and server sync
    setSelectedNode(selectedNode);
  };

  const handleVersionChange = (newVersion: string) => {
    if (!selectedNode) return;

    // Direct mutation for optimistic update
    selectedNode.modelVersion = newVersion;

    setSelectedVersion(newVersion);
    setSelectedNode(selectedNode);
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
        <InstanceInfo
          instance={selectedNode}
          rangedPropertiesCount={rangedProperties.size}
          onUpdate={setSelectedNode}
        />
        <ModelVersionSelector
          availableVersions={availableVersions}
          selectedVersion={selectedVersion}
          modelType={selectedNode.model.type}
          onVersionChange={handleVersionChange}
        />
        <PropertyFilter
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          propertyCount={filteredProperties.length}
        />
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
        <PropertyList
          filteredProperties={filteredProperties}
          rangedProperties={rangedProperties}
          handlePropertyChange={handlePropertyChange}
          handleRangedPropertyChange={handleRangedPropertyChange}
        />
      </div>
    </div>
  );
}