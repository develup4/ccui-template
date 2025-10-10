
import Section from './Section';
import BitMappingInputGroup from './BitMappingInputGroup';
import { IPInstanceBinding } from './types';

interface MappingSectionProps {
  properties: IPInstanceBinding['properties'];
  onUpdate: (updatedBinding: IPInstanceBinding) => void;
  selectedBinding: IPInstanceBinding;
}

export default function MappingSection({ properties, onUpdate, selectedBinding }: MappingSectionProps) {
  const handleMappingToggle = (enabled: boolean) => {
    if (!onUpdate) return;

    const updatedBinding = {
      ...selectedBinding,
      properties: enabled ? {
        ...properties,
        mapping: {
          value: {
            from: { value: [] },
            to: { value: [] }
          }
        }
      } : Object.fromEntries(
        Object.entries(properties || {}).filter(([key]) => key !== 'mapping')
      )
    };

    onUpdate(updatedBinding);
  };

  const handleMappingFromAdd = () => {
    if (!onUpdate) return;

    const currentFrom = properties?.mapping?.value?.from?.value || [];
    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties?.mapping?.value,
            from: {
              value: [...currentFrom, { value: 0 }]
            }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleMappingFromChange = (index: number, value: string) => {
    if (!onUpdate) return;

    const currentFrom = properties?.mapping?.value?.from?.value || [];
    const newFrom = [...currentFrom];
    newFrom[index] = { value: parseInt(value) || 0 };

    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties?.mapping?.value,
            from: { value: newFrom }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleMappingFromRemove = (index: number) => {
    if (!onUpdate) return;

    const currentFrom = properties?.mapping?.value?.from?.value || [];
    const newFrom = currentFrom.filter((_, i) => i !== index);

    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties?.mapping?.value,
            from: { value: newFrom }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleMappingToAdd = () => {
    if (!onUpdate) return;

    const currentTo = properties?.mapping?.value?.to?.value || [];
    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties?.mapping?.value,
            to: {
              value: [...currentTo, { value: 0 }]
            }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleMappingToChange = (index: number, value: string) => {
    if (!onUpdate) return;

    const currentTo = properties?.mapping?.value?.to?.value || [];
    const newTo = [...currentTo];
    newTo[index] = { value: parseInt(value) || 0 };

    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties?.mapping?.value,
            to: { value: newTo }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const handleMappingToRemove = (index: number) => {
    if (!onUpdate) return;

    const currentTo = properties?.mapping?.value?.to?.value || [];
    const newTo = currentTo.filter((_, i) => i !== index);

    const updatedBinding = {
      ...selectedBinding,
      properties: {
        ...properties,
        mapping: {
          value: {
            ...properties?.mapping?.value,
            to: { value: newTo }
          }
        }
      }
    };

    onUpdate(updatedBinding);
  };

  const mappingFromValues = properties?.mapping?.value?.from?.value || [];
  const mappingToValues = properties?.mapping?.value?.to?.value || [];

  return (
    <Section
      title="Bit Mapping"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      }
      color="purple"
      enabled={properties?.mapping !== undefined}
      onToggle={handleMappingToggle}
    >
      <BitMappingInputGroup
        title="From Bits"
        values={mappingFromValues}
        onAdd={handleMappingFromAdd}
        onChange={handleMappingFromChange}
        onRemove={handleMappingFromRemove}
      />
      <BitMappingInputGroup
        title="To Bits"
        values={mappingToValues}
        onAdd={handleMappingToAdd}
        onChange={handleMappingToChange}
        onRemove={handleMappingToRemove}
      />
    </Section>
  );
}
