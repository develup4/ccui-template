
'use client';

import { useExplorer } from '../../contexts/ExplorerContext';
import EmptyState from './EmptyState';
import BindingInformation from './BindingInformation';
import MappingSection from './MappingSection';
import CrossingSection from './CrossingSection';

export default function IPInstanceBindingPanel() {
  const { selectedBinding } = useExplorer();

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
          selectedBinding={selectedBinding}
        />
        <CrossingSection
          properties={properties}
          selectedBinding={selectedBinding}
        />
      </div>
    </div>
  );
}
