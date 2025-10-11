'use client';

import { createContext, useContext } from 'react';
import { IPInstance } from '../sample-data';
import { IPInstancePort, IPInstanceBinding } from '../data-structure';

interface ExplorerContextType {
  selectedNode: IPInstance | null;
  setSelectedNode: (node: IPInstance | null) => void;
  selectedPort: IPInstancePort | null;
  setSelectedPort: (port: IPInstancePort | null) => void;
  selectedBinding: IPInstanceBinding | null;
  setSelectedBinding: (binding: IPInstanceBinding | null) => void;
  triggerUpdate: () => void; // Force re-render after mutation
}

export const ExplorerContext = createContext<ExplorerContextType | undefined>(undefined);

export const useExplorer = () => {
  const context = useContext(ExplorerContext);
  if (!context) {
    throw new Error('useExplorer must be used within an ExplorerProvider');
  }
  return context;
};
