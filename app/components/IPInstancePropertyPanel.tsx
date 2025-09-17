'use client';

import { useState, useEffect } from 'react';
import { IPInstance } from '../sample-data';

interface IPInstancePropertyPanelProps {
  selectedInstance: IPInstance | null;
  onUpdate?: (updatedInstance: IPInstance) => void;
}

interface PropertyInputProps {
  propertyKey: string;
  propertyData: any;
  currentValue: any;
  isModified: boolean;
  isRanged: boolean;
  onValueChange: (value: any) => void;
  onRangedChange: (ranged: boolean) => void;
}

function PropertyInput({ 
  propertyKey, 
  propertyData, 
  currentValue, 
  isModified, 
  isRanged,
  onValueChange, 
  onRangedChange 
}: PropertyInputProps) {
  const renderConstraintTooltip = () => {
    const { constraint } = propertyData;
    if (constraint.type === 'None') return null;
    
    let tooltipText = '';
    if (constraint.type === 'range') {
      tooltipText = `Range: ${constraint.value.from} - ${constraint.value.to}`;
    } else if (constraint.type === 'list') {
      tooltipText = `Options: ${constraint.value.join(', ')}`;
    }
    
    return (
      <span 
        className="ml-2 text-yellow-400 cursor-help" 
        title={tooltipText}
      >
        ⓘ
      </span>
    );
  };

  const renderInput = () => {
    const { type, constraint } = propertyData;
    const baseClassName = `w-full px-3 py-2 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      isModified ? 'bg-orange-900 border-orange-500' : 'bg-gray-800 border-gray-600'
    }`;

    switch (type) {
      case 'String':
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className={baseClassName}
          />
        );

      case 'Number':
        const numProps: any = { type: 'number' };
        if (constraint.type === 'range') {
          numProps.min = constraint.value.from;
          numProps.max = constraint.value.to;
        }
        return (
          <input
            {...numProps}
            value={currentValue || 0}
            onChange={(e) => onValueChange(Number(e.target.value))}
            className={baseClassName}
          />
        );

      case 'String Select':
      case 'Number Select':
        const options = constraint.type === 'list' ? constraint.value : [];
        return (
          <select
            value={currentValue || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className={baseClassName}
          >
            {options.map((option: any) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'Boolean':
        return (
          <select
            value={currentValue ? 'true' : 'false'}
            onChange={(e) => onValueChange(e.target.value === 'true')}
            className={baseClassName}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );

      case 'Address':
        const addressValue = currentValue || '0x00000000';
        const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value = e.target.value;
          if (!value.startsWith('0x')) {
            value = '0x' + value;
          }
          // Validate constraint if range type
          if (constraint.type === 'range') {
            const numValue = parseInt(value, 16);
            const minValue = parseInt(constraint.value.from.toString(), 16);
            const maxValue = parseInt(constraint.value.to.toString(), 16);
            if (numValue >= minValue && numValue <= maxValue) {
              onValueChange(value);
            }
          } else {
            onValueChange(value);
          }
        };

        return (
          <div className="flex">
            <span className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-md text-gray-300">
              0x
            </span>
            <input
              type="text"
              value={addressValue.replace('0x', '')}
              onChange={handleAddressChange}
              maxLength={8}
              className={`flex-1 px-3 py-2 border rounded-r-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isModified ? 'bg-orange-900 border-orange-500' : 'bg-gray-800 border-gray-600'
              }`}
            />
          </div>
        );

      case 'Complex':
        return (
          <textarea
            value={typeof currentValue === 'object' ? JSON.stringify(currentValue, null, 2) : currentValue || '{}'}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onValueChange(parsed);
              } catch {
                // Invalid JSON, keep as string for now
                onValueChange(e.target.value);
              }
            }}
            rows={4}
            className={baseClassName}
          />
        );

      default:
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => onValueChange(e.target.value)}
            className={baseClassName}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="block text-sm font-medium text-gray-300">
            {propertyKey}
          </label>
          {renderConstraintTooltip()}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`ranged-${propertyKey}`}
            checked={isRanged}
            onChange={(e) => onRangedChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor={`ranged-${propertyKey}`} className="text-xs text-gray-400">
            Ranged
          </label>
        </div>
      </div>
      
      {propertyData.description && (
        <p className="text-xs text-gray-500">{propertyData.description}</p>
      )}
      
      {renderInput()}
      
      {isModified && (
        <p className="text-xs text-orange-400">Modified from default: {propertyData.defaultValue}</p>
      )}
    </div>
  );
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
      <div className="w-full h-full p-6 font-montserrat" style={{ backgroundColor: '#060B15' }}>
        <div className="text-center text-gray-400 mt-20">
          <h2 className="text-xl mb-4">Properties Panel</h2>
          <p>Select an IPInstance to view and edit its properties</p>
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
    <div className="w-full h-full p-6 font-montserrat overflow-y-auto" style={{ backgroundColor: '#060B15' }}>
      <div className="text-white">
        <h2 className="text-xl font-bold mb-6 text-blue-400">Instance Properties</h2>
        
        {/* Model Version Selection */}
        <div className="mb-6 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-purple-400">Model Version</h3>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-300">Version:</label>
            <select
              value={selectedVersion}
              onChange={(e) => handleVersionChange(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableVersions.map(version => (
                <option key={version} value={version}>{version}</option>
              ))}
            </select>
            <span className="text-sm text-gray-400">
              Model: {selectedInstance.model.type}
            </span>
          </div>
        </div>

        {/* Property Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedTag === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => setSelectedTag('sim')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedTag === 'sim' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Simulation (SIM)
            </button>
            <button
              onClick={() => setSelectedTag('hw')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedTag === 'hw' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Hardware (HW)
            </button>
          </div>
        </div>

        {/* Properties */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-green-400">
            Properties ({filteredProperties.length})
          </h3>
          
          {filteredProperties.length === 0 ? (
            <p className="text-gray-400">No properties available for the selected filter.</p>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map(([propertyKey, propertyData]: [string, any]) => {
                const currentValue = instanceProperties[propertyKey];
                const isModified = currentValue !== undefined && currentValue !== propertyData.defaultValue;
                const isRanged = rangedProperties.has(propertyKey);

                return (
                  <div key={propertyKey} className="p-4 bg-gray-900 rounded-lg">
                    <PropertyInput
                      propertyKey={propertyKey}
                      propertyData={propertyData}
                      currentValue={currentValue !== undefined ? currentValue : propertyData.defaultValue}
                      isModified={isModified}
                      isRanged={isRanged}
                      onValueChange={(value) => handlePropertyChange(propertyKey, value)}
                      onRangedChange={(ranged) => handleRangedPropertyChange(propertyKey, ranged)}
                    />
                    <div className="mt-2 flex items-center space-x-4 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        propertyData.tag === 'sim' ? 'bg-green-600' : 'bg-yellow-600'
                      } text-white`}>
                        {propertyData.tag.toUpperCase()}
                      </span>
                      <span className="text-gray-500">
                        Type: {propertyData.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Read-only Information */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400">Instance Information</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Instance ID:</span>
              <span className="text-white">{selectedInstance.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-white">{selectedInstance.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Hierarchy:</span>
              <span className="text-white">{selectedInstance.hierarchy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Model ID:</span>
              <span className="text-white">{selectedInstance.modelId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Children Count:</span>
              <span className="text-white">{selectedInstance.children.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ranged Properties:</span>
              <span className="text-white">{rangedProperties.size}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}