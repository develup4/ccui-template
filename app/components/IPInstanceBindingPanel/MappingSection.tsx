
import { useExplorer } from '../../contexts/ExplorerContext';
import SettingItem from '../SettingItem';
import SettingCategory from '../SettingCategory';
import BitMappingInput from './BitMappingInput';
import { IPInstanceBinding } from '../../data-structure';

export default function MappingSection() {
  const { selectedBinding, setSelectedBinding } = useExplorer();

  if (!selectedBinding) {
    return null;
  }

  const { properties } = selectedBinding;

  const handleMappingToggle = (enabled: boolean) => {
    // Direct mutation for optimistic update
    if (enabled) {
      if (!selectedBinding.properties) {
        selectedBinding.properties = {};
      }
      selectedBinding.properties.mapping = {
        value: {
          from: { value: [] },
          to: { value: [] }
        }
      };
    } else {
      delete selectedBinding.properties?.mapping;
    }

    setSelectedBinding(selectedBinding);
  };

  const handleMappingFromAdd = () => {
    // Direct mutation for optimistic update
    if (!selectedBinding.properties?.mapping) return;

    const currentFrom = selectedBinding.properties.mapping.value.from?.value || [];
    selectedBinding.properties.mapping.value.from = {
      value: [...currentFrom, { value: 0 }]
    };

    setSelectedBinding(selectedBinding);
  };

  const handleMappingFromChange = (index: number, value: string) => {
    // Direct mutation for optimistic update
    if (!selectedBinding.properties?.mapping?.value.from) return;

    selectedBinding.properties.mapping.value.from.value[index] = { value: parseInt(value) || 0 };

    setSelectedBinding(selectedBinding);
  };

  const handleMappingFromRemove = (index: number) => {
    // Direct mutation for optimistic update
    if (!selectedBinding.properties?.mapping?.value.from) return;

    selectedBinding.properties.mapping.value.from.value =
      selectedBinding.properties.mapping.value.from.value.filter((_, i) => i !== index);

    setSelectedBinding(selectedBinding);
  };

  const handleMappingToAdd = () => {
    // Direct mutation for optimistic update
    if (!selectedBinding.properties?.mapping) return;

    const currentTo = selectedBinding.properties.mapping.value.to?.value || [];
    selectedBinding.properties.mapping.value.to = {
      value: [...currentTo, { value: 0 }]
    };

    setSelectedBinding(selectedBinding);
  };

  const handleMappingToChange = (index: number, value: string) => {
    // Direct mutation for optimistic update
    if (!selectedBinding.properties?.mapping?.value.to) return;

    selectedBinding.properties.mapping.value.to.value[index] = { value: parseInt(value) || 0 };

    setSelectedBinding(selectedBinding);
  };

  const handleMappingToRemove = (index: number) => {
    // Direct mutation for optimistic update
    if (!selectedBinding.properties?.mapping?.value.to) return;

    selectedBinding.properties.mapping.value.to.value =
      selectedBinding.properties.mapping.value.to.value.filter((_, i) => i !== index);

    setSelectedBinding(selectedBinding);
  };

  const mappingFromValues = properties?.mapping?.value?.from?.value || [];
  const mappingToValues = properties?.mapping?.value?.to?.value || [];

  if (properties?.mapping === undefined) {
    return null;
  }

  return (
    <SettingCategory title="Bit Mapping">
      <SettingItem
        category="Binding"
        name="From Bits"
        description="Source bit indices for the mapping"
        isModified={mappingFromValues.length > 0}
      >
        <BitMappingInput
          values={mappingFromValues}
          onAdd={handleMappingFromAdd}
          onChange={handleMappingFromChange}
          onRemove={handleMappingFromRemove}
        />
      </SettingItem>

      <SettingItem
        category="Binding"
        name="To Bits"
        description="Destination bit indices for the mapping"
        isModified={mappingToValues.length > 0}
      >
        <BitMappingInput
          values={mappingToValues}
          onAdd={handleMappingToAdd}
          onChange={handleMappingToChange}
          onRemove={handleMappingToRemove}
        />
      </SettingItem>
    </SettingCategory>
  );
}
