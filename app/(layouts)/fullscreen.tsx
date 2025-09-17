'use client';

import { useState } from 'react';
import IPInstanceTreeView from '../components/IPInstanceTreeView';
import IPInstancePropertyPanel from '../components/IPInstancePropertyPanel';
import { sampleIPInstanceHierarchy, IPInstance } from '../sample-data';

export default function FullscreenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectedNode, setSelectedNode] = useState<IPInstance | null>(null);
  
  // Helper function to find instance by hierarchy
  const findInstanceByHierarchy = (instance: IPInstance, hierarchy: string): IPInstance | null => {
    if (instance.hierarchy === hierarchy) {
      return instance;
    }
    
    for (const child of instance.children) {
      const found = findInstanceByHierarchy(child, hierarchy);
      if (found) return found;
    }
    
    return null;
  };

  const handleNodeSelect = (hierarchy: string) => {
    const instance = findInstanceByHierarchy(sampleIPInstanceHierarchy, hierarchy);
    setSelectedNode(instance);
  };

  const handleInstanceUpdate = (updatedInstance: IPInstance) => {
    setSelectedNode(updatedInstance);
    // Here you could also update the main data structure if needed
  };

  return (
        <div className="w-full h-screen" style={{ backgroundColor: '#060B15' }}>
            <div className="w-full min-h-[10rem]"></div>
            <div className="size-full flex">
                <div className="w-[30rem]" style={{ backgroundColor: '#060B15' }}>
                    <IPInstanceTreeView 
                        rootInstance={sampleIPInstanceHierarchy}
                        onSelect={handleNodeSelect}
                    />
                </div>
                {children}
                <div className="w-[30rem]">
                    <IPInstancePropertyPanel 
                        selectedInstance={selectedNode}
                        onUpdate={handleInstanceUpdate}
                    />
                </div>
            </div>
        </div>  
    );
}
