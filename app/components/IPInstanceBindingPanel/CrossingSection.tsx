
import { useExplorer } from '../../contexts/ExplorerContext';
import SettingItem from '../SettingItem';
import SettingCategory from '../SettingCategory';
import { IPInstanceBinding } from '../../data-structure';

export default function CrossingSection() {
  const { selectedBinding, setSelectedBinding } = useExplorer();

  if (!selectedBinding) {
    return null;
  }

  const { properties } = selectedBinding;

  const handleCrossingToggle = (enabled: boolean) => {
    // Direct mutation for optimistic update
    if (enabled) {
      if (!selectedBinding.properties) {
        selectedBinding.properties = {};
      }
      selectedBinding.properties.crossing = {
        value: {
          type: { value: 'sync' as const },
          fifo_size: { value: 0 },
          direction: { value: 'none' as const },
          source_sync: { value: 0 },
          sink_sync: { value: 0 }
        }
      };
    } else {
      delete selectedBinding.properties?.crossing;
    }

    setSelectedBinding(selectedBinding);
  };

  const handleCrossingChange = (field: 'type' | 'fifo_size' | 'direction' | 'source_sync' | 'sink_sync', value: any) => {
    // Direct mutation for optimistic update
    if (!selectedBinding.properties?.crossing) return;

    selectedBinding.properties.crossing.value[field] = { value };

    setSelectedBinding(selectedBinding);
  };

  const crossing = properties?.crossing?.value;

  if (properties?.crossing === undefined) {
    return null;
  }

  return (
    <SettingCategory title="Clock Domain Crossing">
      <SettingItem
        category="Binding"
        name="Type"
        description="Type of clock domain crossing (sync or async)"
        isModified={crossing?.type?.value !== 'sync'}
      >
        <select
          value={crossing?.type?.value ?? 'sync'}
          onChange={(e) => handleCrossingChange('type', e.target.value)}
          className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="sync">Sync</option>
          <option value="async">Async</option>
        </select>
      </SettingItem>

      <SettingItem
        category="Binding"
        name="FIFO Size"
        description="Size of the FIFO buffer for clock domain crossing"
        isModified={(crossing?.fifo_size?.value ?? 0) > 0}
      >
        <input
          type="number"
          value={crossing?.fifo_size?.value ?? 0}
          onChange={(e) => handleCrossingChange('fifo_size', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </SettingItem>

      <SettingItem
        category="Binding"
        name="Direction"
        description="Direction of the clock domain crossing"
        isModified={crossing?.direction?.value !== 'none'}
      >
        <select
          value={crossing?.direction?.value ?? 'none'}
          onChange={(e) => handleCrossingChange('direction', e.target.value)}
          className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="from">From</option>
          <option value="none">None</option>
        </select>
      </SettingItem>

      <SettingItem
        category="Binding"
        name="Source Sync"
        description="Source synchronization stages"
        isModified={(crossing?.source_sync?.value ?? 0) > 0}
      >
        <input
          type="number"
          value={crossing?.source_sync?.value ?? 0}
          onChange={(e) => handleCrossingChange('source_sync', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </SettingItem>

      <SettingItem
        category="Binding"
        name="Sink Sync"
        description="Sink synchronization stages"
        isModified={(crossing?.sink_sync?.value ?? 0) > 0}
      >
        <input
          type="number"
          value={crossing?.sink_sync?.value ?? 0}
          onChange={(e) => handleCrossingChange('sink_sync', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </SettingItem>
    </SettingCategory>
  );
}
