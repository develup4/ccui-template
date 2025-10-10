'use client';

import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { IPInstance } from '../sample-data';
import { IPInstancePort, IPInstanceBinding } from '../data-structure';

interface SelectionContextType {
  selectedNode: IPInstance | null;
  setSelectedNode: Dispatch<SetStateAction<IPInstance | null>>;
  selectedPort: IPInstancePort | null;
  setSelectedPort: Dispatch<SetStateAction<IPInstancePort | null>>;
  selectedEdge: IPInstanceBinding | null;
  setSelectedEdge: Dispatch<SetStateAction<IPInstanceBinding | null>>;
}

export const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};
