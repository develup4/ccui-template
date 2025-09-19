'use client';

import { useState } from 'react';
import { IPInstance } from '../sample-data';

interface InstanceInfoProps {
  instance: IPInstance;
  rangedPropertiesCount: number;
  onUpdate?: (updatedInstance: IPInstance) => void;
}

export default function InstanceInfo({ instance, rangedPropertiesCount, onUpdate }: InstanceInfoProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(instance.name);
  const [isEditingDisplay, setIsEditingDisplay] = useState(false);

  const currentVersionData = instance.model.data[instance.modelVersion];
  const displayData = currentVersionData?.display;
  const handleNameSave = () => {
    if (onUpdate && editedName.trim()) {
      const updatedInstance = {
        ...instance,
        name: editedName.trim()
      };
      onUpdate(updatedInstance);
      setIsEditingName(false);
    }
  };

  const handleNameCancel = () => {
    setEditedName(instance.name);
    setIsEditingName(false);
  };

  const handleDisplayUpdate = (emoji: string, color: string) => {
    if (onUpdate) {
      const updatedInstance = {
        ...instance,
        model: {
          ...instance.model,
          data: {
            ...instance.model.data,
            [instance.modelVersion]: {
              ...currentVersionData,
              display: {
                ...displayData,
                emoji: emoji,
                color: {
                  ...displayData?.color,
                  primary: color
                }
              }
            }
          }
        }
      };
      onUpdate(updatedInstance);
    }
  };

  return (
    <div className="bg-gradient-to-br from-overlay to-overlay/80 border border-bd rounded-xl shadow-lg">
      <div className="p-5">
        <h3 className="text-sm font-bold flex items-center gap-3 text-txt mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-highlight to-highlight/80 rounded-lg flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Instance Information
        </h3>

        <div className="space-y-3">
          {/* Instance Name - 편집 가능 */}
          <div className="bg-background/50 rounded-lg p-3 border border-bd/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-txt/70 mb-1">Name:</span>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-xs text-highlight hover:text-highlight/80 transition-colors"
              >
                Edit
              </button>
            </div>
            {isEditingName ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 text-sm bg-background border border-bd rounded px-2 py-1 text-txt focus:outline-none focus:ring-2 focus:ring-highlight/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave();
                    if (e.key === 'Escape') handleNameCancel();
                  }}
                  autoFocus
                />
                <button
                  onClick={handleNameSave}
                  className="px-2 py-1 bg-highlight text-white text-xs rounded hover:bg-highlight/80 transition-colors"
                >
                  ✓
                </button>
                <button
                  onClick={handleNameCancel}
                  className="px-2 py-1 bg-txt/20 text-txt text-xs rounded hover:bg-txt/30 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="text-sm font-medium text-txt">{instance.name}</div>
            )}
          </div>

          {/* Display Information - 편집 가능 */}
          <div className="bg-background/50 rounded-lg p-3 border border-bd/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-txt/70">Display:</span>
              <button
                onClick={() => setIsEditingDisplay(!isEditingDisplay)}
                className="text-xs text-highlight hover:text-highlight/80 transition-colors"
              >
                {isEditingDisplay ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{displayData?.emoji || '🔧'}</span>
                <div
                  className="w-4 h-4 rounded border border-bd/50"
                  style={{ backgroundColor: displayData?.color?.primary || '#666' }}
                />
              </div>
              <span className="text-sm text-txt">{instance.model.type}</span>
            </div>
            {isEditingDisplay && (
              <div className="mt-3 space-y-2">
                <div>
                  <label className="text-xs text-txt/70 block mb-1">Icon:</label>
                  <div className="flex gap-1">
                    {['🔧', '⚡', '💾', '🔌', '❤️', '🖥️', '🔥', '📡'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleDisplayUpdate(emoji, displayData?.color?.primary || '#666')}
                        className="w-8 h-8 bg-background border border-bd rounded hover:border-highlight transition-colors flex items-center justify-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-txt/70 block mb-1">Border Color:</label>
                  <div className="flex gap-1">
                    {['#FF6B00', '#00aa44', '#ff6600', '#9966cc', '#cc3366', '#66cc99', '#3399ff', '#ff9900'].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleDisplayUpdate(displayData?.emoji || '🔧', color)}
                        className="w-6 h-6 rounded border-2 border-white/50 hover:border-white transition-colors"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Other Information */}
          <div className="space-y-2">
            {[
              { label: 'Instance ID', value: instance.id },
              { label: 'Hierarchy', value: instance.hierarchy },
              { label: 'Model ID', value: instance.modelId },
              { label: 'Children', value: instance.children.length },
              { label: 'Ranged Properties', value: rangedPropertiesCount }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-bd/20 last:border-b-0">
                <span className="text-xs font-medium text-txt/70">{item.label}:</span>
                <div className="text-right">
                  {item.label === 'Hierarchy' ? (
                    <code className="text-xs bg-background border border-bd px-2 py-1 rounded text-highlight font-mono">
                      {item.value}
                    </code>
                  ) : (
                    <span className="text-sm text-txt font-medium">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}