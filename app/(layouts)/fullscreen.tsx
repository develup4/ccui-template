'use client';

import { useState } from 'react';
import IPInstanceTreeView from '../components/IPInstanceTreeView';
import IPInstancePropertyPanel from '../components/IPInstancePropertyPanel';
import IPInstancePortPanel from '../components/IPInstancePortPanel';
import IPInstanceBindingPanel from '../components/IPInstanceBindingPanel';
import { sampleIPInstanceHierarchy, IPInstance } from '../sample-data';

type SelectionType = 'instance' | 'port' | 'binding';

interface IPInstancePort {
  instanceId: string;
  portName: string;
  properties?: {
    mapping?: {
      value: {
        base: { value: string };
        size: { value: string };
        remap: { value: string };
        add_offset: { value: string };
        remove_offset: { value: boolean };
      }
    };
    size?: number;
    bypass_mapping: boolean;
  };
}

interface IPInstanceBinding {
  from: string;
  to: string;
  properties?: {
    mapping?: {
      value: {
        from?: {
          value: {
            value: number;
          }[]
        };
        to?: {
          value: {
            value: number;
          }[]
        }
      }
    };
    crossing?: {
      value: {
        type: { value: "sync" | "async" };
        fifo_size: { value: number };
        direction: { value: "from" | "none" };
        source_sync: { value: number };
        sink_sync: { value: number };
      }
    }
  };
}

export default function FullscreenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [selectionType, setSelectionType] = useState<SelectionType>('instance');
  const [selectedNode, setSelectedNode] = useState<IPInstance | null>(null);
  const [selectedPort, setSelectedPort] = useState<IPInstancePort | null>(null);
  const [selectedBinding, setSelectedBinding] = useState<IPInstanceBinding | null>(null);

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
    setSelectionType('instance');
  };

  const handleInstanceUpdate = (updatedInstance: IPInstance) => {
    setSelectedNode(updatedInstance);
    // Here you could also update the main data structure if needed
  };

  const handlePortUpdate = (updatedPort: IPInstancePort) => {
    setSelectedPort(updatedPort);
    // Here you could also update the main data structure if needed
  };

  const handleBindingUpdate = (updatedBinding: IPInstanceBinding) => {
    setSelectedBinding(updatedBinding);
    // Here you could also update the main data structure if needed
  };

  // These will be exposed globally so canvas can trigger port/binding selection
  if (typeof window !== 'undefined') {
    (window as any).selectPort = (port: IPInstancePort) => {
      setSelectedPort(port);
      setSelectionType('port');
    };
    (window as any).selectBinding = (binding: IPInstanceBinding) => {
      setSelectedBinding(binding);
      setSelectionType('binding');
    };
  }

  // Sample data for testing - properties are optional, demonstrating toggle feature
  const samplePort: IPInstancePort = {
    instanceId: 'top.cpu',
    portName: 'axi_master',
    properties: {
      // Initially only size is set, others can be toggled on
      size: 4096
    }
  };

  const sampleBinding: IPInstanceBinding = {
    from: 'top.cpu.axi_master',
    to: 'top.memory.axi_slave',
    properties: {
      // Initially empty, properties can be toggled on
    }
  };

  return (
        <div className="w-full h-screen bg-background">
            <div className="w-full min-h-[8rem] bg-overlay"></div>
            <div className="size-full flex">
                <div className="w-[28rem] bg-background border-r border-bd">
                    <IPInstanceTreeView
                        rootInstance={sampleIPInstanceHierarchy}
                        onSelect={handleNodeSelect}
                    />
                </div>
                {children}
                <div className="w-[28rem] bg-background border-l border-bd flex flex-col">
                    {/* Tab Bar */}
                    <div className="flex border-b border-bd bg-overlay">
                      <button
                        onClick={() => setSelectionType('instance')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                          selectionType === 'instance'
                            ? 'bg-background text-txt border-b-2 border-blue-500'
                            : 'text-txt/60 hover:text-txt hover:bg-background/50'
                        }`}
                      >
                        Instance
                      </button>
                      <button
                        onClick={() => {
                          setSelectionType('port');
                          setSelectedPort(samplePort);
                        }}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                          selectionType === 'port'
                            ? 'bg-background text-txt border-b-2 border-blue-500'
                            : 'text-txt/60 hover:text-txt hover:bg-background/50'
                        }`}
                      >
                        Port
                      </button>
                      <button
                        onClick={() => {
                          setSelectionType('binding');
                          setSelectedBinding(sampleBinding);
                        }}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                          selectionType === 'binding'
                            ? 'bg-background text-txt border-b-2 border-blue-500'
                            : 'text-txt/60 hover:text-txt hover:bg-background/50'
                        }`}
                      >
                        Binding
                      </button>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-hidden">
                      {selectionType === 'instance' && (
                        <IPInstancePropertyPanel
                            selectedInstance={selectedNode}
                            onUpdate={handleInstanceUpdate}
                        />
                      )}
                      {selectionType === 'port' && (
                        <IPInstancePortPanel
                            selectedPort={selectedPort}
                            onUpdate={handlePortUpdate}
                        />
                      )}
                      {selectionType === 'binding' && (
                        <IPInstanceBindingPanel
                            selectedBinding={selectedBinding}
                            onUpdate={handleBindingUpdate}
                        />
                      )}
                    </div>
                </div>
            </div>
        </div>
    );
}
