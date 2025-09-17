'use client';

import { IPInstance } from '../sample-data';

interface InstanceInfoProps {
  instance: IPInstance;
  rangedPropertiesCount: number;
}

export default function InstanceInfo({ instance, rangedPropertiesCount }: InstanceInfoProps) {
  const infoItems = [
    { label: 'Instance ID', value: instance.id },
    { label: 'Name', value: instance.name },
    { label: 'Hierarchy', value: instance.hierarchy },
    { label: 'Model ID', value: instance.modelId },
    { label: 'Children', value: instance.children.length },
    { label: 'Ranged Properties', value: rangedPropertiesCount }
  ];

  return (
    <div className="bg-overlay border border-bd rounded-lg shadow-sm">
      <div className="p-4">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-txt mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Instance Information
        </h3>

        <div className="space-y-2">
          {infoItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-1 border-b border-bd/30 last:border-b-0">
              <span className="text-xs font-medium text-txt/70">{item.label}:</span>
              <div className="text-right">
                {item.label === 'Hierarchy' ? (
                  <code className="text-xs bg-background border border-bd px-2 py-1 rounded text-highlight font-mono">
                    {item.value}
                  </code>
                ) : (
                  <span className="text-sm text-txt">{item.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}