'use client';

import { useExplorer } from '../../contexts/ExplorerContext';
import PropertyInput from '../PropertyInput';

interface PropertyListProps {
    filteredProperties: [string, any][];
    rangedProperties: Set<string>;
    handlePropertyChange: (propertyKey: string, newValue: any) => void;
    handleRangedPropertyChange: (propertyKey: string, isRanged: boolean) => void;
}

export default function PropertyList({
    filteredProperties,
    rangedProperties,
    handlePropertyChange,
    handleRangedPropertyChange,
}: PropertyListProps) {
    const { selectedNode } = useExplorer();

    if (!selectedNode) {
        return null;
    }

    const instanceProperties = selectedNode.data?.properties || {};

    if (filteredProperties.length === 0) {
        return (
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
        );
    }

    return (
        <div>
            {filteredProperties.map(([propertyKey, propertyData]: [string, any]) => {
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
            })}
        </div>
    );
}
