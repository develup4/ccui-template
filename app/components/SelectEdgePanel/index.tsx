
'use client';

import { useSelection } from '../../contexts/SelectionContext';
import EmptyState from './EmptyState';
import BindingInformation from './BindingInformation';
import MappingSection from './MappingSection';
import CrossingSection from './CrossingSection';

export default function SelectEdgePanel() {
  const { selectedEdge } = useSelection();

  if (!selectedEdge) {
    return <EmptyState />;
  }

  const properties = selectedEdge.properties || {};

  return (
    <div className="w-full h-full p-3 bg-background overflow-y-auto">
      <div className="space-y-3">
        <BindingInformation selectedBinding={selectedEdge} />
        <MappingSection
          properties={properties}
          selectedBinding={selectedEdge}
        />
        <CrossingSection
          properties={properties}
          selectedBinding={selectedEdge}
        />
      </div>
    </div>
  );
}
