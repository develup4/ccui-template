
import { useSelection } from '../../contexts/SelectionContext';
import Section from './Section';
import BitMappingInputGroup from './BitMappingInputGroup';
import { IPInstanceBinding } from '../../data-structure';

export default function MappingSection() {
  const { selectedEdge, setSelectedEdge } = useSelection();

  if (!selectedEdge) {
    return null;
  }

  const { properties } = selectedEdge;

  const handleMappingToggle = (enabled: boolean) => {
    const updatedBinding = {
      ...selectedEdge,
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

    setSelectedEdge(updatedBinding);
  };

  const handleMappingFromAdd = () => {
    const currentFrom = properties?.mapping?.value?.from?.value || [];
    const updatedBinding = {
      ...selectedEdge,
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

    setSelectedEdge(updatedBinding);
  };

  const handleMappingFromChange = (index: number, value: string) => {
    const currentFrom = properties?.mapping?.value?.from?.value || [];
    const newFrom = [...currentFrom];
    newFrom[index] = { value: parseInt(value) || 0 };

    const updatedBinding = {
      ...selectedEdge,
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

    setSelectedEdge(updatedBinding);
  };

  const handleMappingFromRemove = (index: number) => {
    const currentFrom = properties?.mapping?.value?.from?.value || [];
    const newFrom = currentFrom.filter((_, i) => i !== index);

    const updatedBinding = {
      ...selectedEdge,
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

    setSelectedEdge(updatedBinding);
  };

  const handleMappingToAdd = () => {
    const currentTo = properties?.mapping?.value?.to?.value || [];
    const updatedBinding = {
      ...selectedEdge,
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

    setSelectedEdge(updatedBinding);
  };

  const handleMappingToChange = (index: number, value: string) => {
    const currentTo = properties?.mapping?.value?.to?.value || [];
    const newTo = [...currentTo];
    newTo[index] = { value: parseInt(value) || 0 };

    const updatedBinding = {
      ...selectedEdge,
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

    setSelectedEdge(updatedBinding);
  };

  const handleMappingToRemove = (index: number) => {
    const currentTo = properties?.mapping?.value?.to?.value || [];
    const newTo = currentTo.filter((_, i) => i !== index);

    const updatedBinding = {
      ...selectedEdge,
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

    setSelectedEdge(updatedBinding);
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
