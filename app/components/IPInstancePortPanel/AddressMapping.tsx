'use client';

import { useExplorer } from '../../contexts/ExplorerContext';
import SettingItem from '../SettingItem';
import SettingCategory from '../SettingCategory';

export default function AddressMapping() {
    const { selectedPort, setSelectedPort } = useExplorer();

    if (!selectedPort) {
        return null;
    }

    const properties = selectedPort.properties || {};

    const handleMappingChange = (field: 'base' | 'size' | 'remap' | 'add_offset', value: string) => {
        // Direct mutation for optimistic update
        if (!selectedPort.properties!.mapping) {
            selectedPort.properties!.mapping = {
                value: {
                    base: { value: '' },
                    size: { value: '' },
                    remap: { value: '' },
                    add_offset: { value: '' },
                    remove_offset: { value: false }
                }
            };
        }

        selectedPort.properties!.mapping.value[field] = { value };

        setSelectedPort(selectedPort);
    };

    const handleRemoveOffsetChange = (value: boolean) => {
        // Direct mutation for optimistic update
        if (!selectedPort.properties!.mapping) {
            selectedPort.properties!.mapping = {
                value: {
                    base: { value: '' },
                    size: { value: '' },
                    remap: { value: '' },
                    add_offset: { value: '' },
                    remove_offset: { value: false }
                }
            };
        }

        selectedPort.properties!.mapping.value.remove_offset = { value };

        setSelectedPort(selectedPort);
    };

    const handleMappingToggle = (enabled: boolean) => {
        // Direct mutation for optimistic update
        if (enabled) {
            selectedPort.properties!.mapping = {
                value: {
                    base: { value: '' },
                    size: { value: '' },
                    remap: { value: '' },
                    add_offset: { value: '' },
                    remove_offset: { value: false }
                }
            };
        } else {
            delete selectedPort.properties!.mapping;
        }

        setSelectedPort(selectedPort);
    };

    if (properties.mapping === undefined) {
        return null;
    }

    return (
        <SettingCategory title="Address Mapping">
            <SettingItem
                category="Port"
                name="Base Address"
                description="Base address for the mapping"
                isModified={!!properties.mapping?.value?.base?.value}
            >
                <input
                    type="text"
                    value={properties.mapping?.value?.base?.value ?? ''}
                    onChange={(e) => handleMappingChange('base', e.target.value)}
                    placeholder="0x00000000"
                    className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </SettingItem>

            <SettingItem
                category="Port"
                name="Mapping Size"
                description="Size of the address mapping region"
                isModified={!!properties.mapping?.value?.size?.value}
            >
                <input
                    type="text"
                    value={properties.mapping?.value?.size?.value ?? ''}
                    onChange={(e) => handleMappingChange('size', e.target.value)}
                    placeholder="0x1000"
                    className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </SettingItem>

            <SettingItem
                category="Port"
                name="Remap Address"
                description="Remapped address for the port"
                isModified={!!properties.mapping?.value?.remap?.value}
            >
                <input
                    type="text"
                    value={properties.mapping?.value?.remap?.value ?? ''}
                    onChange={(e) => handleMappingChange('remap', e.target.value)}
                    placeholder="0x00000000"
                    className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </SettingItem>

            <SettingItem
                category="Port"
                name="Add Offset"
                description="Offset to add to the address"
                isModified={!!properties.mapping?.value?.add_offset?.value}
            >
                <input
                    type="text"
                    value={properties.mapping?.value?.add_offset?.value ?? ''}
                    onChange={(e) => handleMappingChange('add_offset', e.target.value)}
                    placeholder="0x0"
                    className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </SettingItem>

            <SettingItem
                category="Port"
                name="Remove Offset"
                description="Remove offset from address mapping"
                isModified={properties.mapping?.value?.remove_offset?.value ?? false}
            >
                <select
                    value={properties.mapping?.value?.remove_offset?.value ? 'true' : 'false'}
                    onChange={(e) => handleRemoveOffsetChange(e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="false">False</option>
                    <option value="true">True</option>
                </select>
            </SettingItem>
        </SettingCategory>
    );
}
