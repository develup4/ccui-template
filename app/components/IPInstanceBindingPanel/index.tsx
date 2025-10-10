
'use client';

import { IPInstanceBinding } from './types';
import EmptyState from './EmptyState';
import BindingInformation from './BindingInformation';
import MappingSection from './MappingSection';
import CrossingSection from './CrossingSection';

interface IPInstanceBindingPanelProps {
  selectedBinding: IPInstanceBinding | null;
  onUpdate?: (updatedBinding: IPInstanceBinding) => void;
}

export default function IPInstanceBindingPanel({ selectedBinding, onUpdate }: IPInstanceBindingPanelProps) {
  if (!selectedBinding) {
    return <EmptyState />;
  }

  const properties = selectedBinding.properties || {};

  return (
    <div className="w-full h-full p-3 bg-background overflow-y-auto">
      <div className="space-y-3">
        <BindingInformation selectedBinding={selectedBinding} />
        <MappingSection
          properties={properties}
          onUpdate={onUpdate!}
          selectedBinding={selectedBinding}
        />
        <CrossingSection
          properties={properties}
          onUpdate={onUpdate!}
          selectedBinding={selectedBinding}
        />
      </div>
    </div>
  );
}
