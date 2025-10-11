'use client';

import { useExplorer } from '../../contexts/ExplorerContext';
import SettingItem from '../SettingItem';
import SettingCategory from '../SettingCategory';

export default function PortConfiguration() {
    const { selectedPort, setSelectedPort } = useExplorer();

    if (!selectedPort) {
        return null;
    }

    const properties = selectedPort.properties || {};

    const handleSizeToggle = (enabled: boolean) => {
        // Direct mutation for optimistic update
        if (enabled) {
            selectedPort.properties!.size = 0;
        } else {
            delete selectedPort.properties!.size;
        }

        setSelectedPort(selectedPort);
    };

    const handleSizeChange = (value: string) => {
        const numValue = value === '' ? 0 : parseInt(value);

        // Direct mutation for optimistic update
        selectedPort.properties!.size = numValue;

        setSelectedPort(selectedPort);
    };

    const handleBypassMappingToggle = (enabled: boolean) => {
        // Direct mutation for optimistic update
        if (enabled) {
            selectedPort.properties!.bypass_mapping = false;
        } else {
            delete selectedPort.properties!.bypass_mapping;
        }

        setSelectedPort(selectedPort);
    };

    const handleBypassMappingChange = (value: boolean) => {
        // Direct mutation for optimistic update
        selectedPort.properties!.bypass_mapping = value;

        setSelectedPort(selectedPort);
    };

    return (
        <SettingCategory title="Configuration">
            <SettingItem
                category="Port"
                name="Size"
                description="Size of the port in bytes"
                isModified={properties.size !== undefined}
            >
                <input
                    type="number"
                    value={properties.size ?? 0}
                    onChange={(e) => handleSizeChange(e.target.value)}
                    placeholder="Enter size"
                    className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </SettingItem>

            <SettingItem
                category="Port"
                name="Bypass Mapping"
                description="Skip address mapping for this port"
                isModified={'bypass_mapping' in properties}
            >
                <select
                    value={properties.bypass_mapping ? 'true' : 'false'}
                    onChange={(e) => handleBypassMappingChange(e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-background border border-bd rounded-lg text-txt text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="false">False</option>
                    <option value="true">True</option>
                </select>
            </SettingItem>
        </SettingCategory>
    );
}
