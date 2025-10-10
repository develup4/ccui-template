
import Section from './Section';
import { IPInstanceBinding } from './types';

interface CrossingSectionProps {
  properties: IPInstanceBinding['properties'];
  onUpdate: (updatedBinding: IPInstanceBinding) => void;
  selectedBinding: IPInstanceBinding;
}

export default function CrossingSection({ properties, onUpdate, selectedBinding }: CrossingSectionProps) {
  const handleCrossingToggle = (enabled: boolean) => {
    if (!onUpdate) return;

    const updatedBinding = {
      ...selectedBinding,
      properties: enabled ? {
        ...properties,
        crossing: {
          value: {
            type: { value: 'sync' as const },
            fifo_size: { value: 0 },
            direction: { value: 'none' as const },
            source_sync: { value: 0 },
            sink_sync: { value: 0 }
          }
        }
      } : Object.fromEntries(
        Object.entries(properties || {}).filter(([key]) => key !== 'crossing')
      )
    };

    onUpdate(updatedBinding);
  };

  const handleCrossingChange = (field: 'type' | 'fifo_size' | 'direction' | 'source_sync' | 'sink_sync', value: any) => {
    if (!onUpdate) return;

    const currentCrossing = properties?.crossing?.value || {
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

  const crossing = properties?.crossing?.value;

  return (
    <Section
      title="Clock Domain Crossing"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      }
      color="orange"
      enabled={properties?.crossing !== undefined}
      onToggle={handleCrossingToggle}
    >
      <div className="space-y-3">
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
    </Section>
  );
}
