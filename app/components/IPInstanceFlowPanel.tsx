'use client';

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Position,
  Handle,
  NodeProps,
  EdgeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { IPInstance } from '../sample-data';
import { useExplorer } from '../contexts/ExplorerContext';
import { IPInstanceBinding } from '../data-structure';

interface IPInstanceFlowPanelProps {
  rootInstance: IPInstance;
}

interface FlowNodeData {
  instance: IPInstance;
  isPortsVisible: boolean;
  onTogglePorts: () => void;
}

const getPortColor = (portType: string) => {
  const colors: Record<string, string> = {
    'clock': '#FFA500',
    'signal': '#00FF00',
    'data': '#FF0000',
    'control': '#0080FF',
    'power': '#FF00FF',
    'default': '#CCCCCC'
  };
  return colors[portType] || colors.default;
};

function CustomNode({ data }: NodeProps<FlowNodeData>) {
  const { instance, isPortsVisible, onTogglePorts } = data;
  const modelData = instance.model.data[instance.modelVersion];
  const display = modelData?.display;
  const ports = modelData?.ports || {};

  const inputPorts = Object.entries(ports).filter(([_, port]: [string, any]) =>
    port.direction === 'left'
  );
  const outputPorts = Object.entries(ports).filter(([_, port]: [string, any]) =>
    port.direction === 'right'
  );

  // Generate some sample properties for display
  const properties = modelData?.properties || {};
  const propertyEntries = Object.entries(properties).slice(0, 6); // Show max 6 properties

  return (
    <div
      className="relative border border-gray-400 bg-gray-900 min-w-[180px]"
      style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #555',
        borderRadius: '4px',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.4)'
      }}
    >
      {/* Header */}
      <div
        className="px-2 py-1 text-white text-xs font-bold flex items-center gap-1 border-b border-gray-600"
        style={{
          backgroundColor: display?.color?.primary || '#FF6B00',
          color: '#000'
        }}
      >
        <span className="text-xs">{instance.model.type}</span>
        <button
          onClick={onTogglePorts}
          className="ml-auto text-xs hover:bg-black hover:bg-opacity-20 rounded px-1"
          title={isPortsVisible ? "Hide ports" : "Show ports"}
        >
          {isPortsVisible ? '◐' : '○'}
        </button>
      </div>

      {/* Body with property list */}
      <div className="px-2 py-1 min-h-[60px]">
        {propertyEntries.map(([propName, propData], index) => (
          <div key={propName} className="flex items-center justify-between text-xs py-0.5">
            <span className="text-gray-300 font-mono">{propName}</span>
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full border border-gray-400"
                style={{ backgroundColor: getPortColor('data') }}
              />
              <span className="text-gray-400 text-xs">S</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Handles */}
      {isPortsVisible && inputPorts.map(([portName, portData], index) => (
        <Handle
          key={`input-${portName}`}
          type="target"
          position={Position.Left}
          id={portName}
          style={{
            background: getPortColor(portData.type),
            border: '1px solid #333',
            width: '8px',
            height: '8px',
            left: '-4px',
            top: `${20 + (index + 1) * 15}px`
          }}
        />
      ))}

      {/* Output Handles */}
      {isPortsVisible && outputPorts.map(([portName, portData], index) => (
        <Handle
          key={`output-${portName}`}
          type="source"
          position={Position.Right}
          id={portName}
          style={{
            background: getPortColor(portData.type),
            border: '1px solid #333',
            width: '8px',
            height: '8px',
            right: '-4px',
            top: `${20 + (index + 1) * 15}px`
          }}
        />
      ))}
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

function getAllInstances(instance: IPInstance): IPInstance[] {
  const instances = [instance];
  instance.children.forEach(child => {
    instances.push(...getAllInstances(child));
  });
  return instances;
}

function createNodesFromInstances(rootInstance: IPInstance): Node<FlowNodeData>[] {
  const allInstances = getAllInstances(rootInstance);
  const nodes: Node<FlowNodeData>[] = [];

  allInstances.forEach((instance, index) => {
    const modelData = instance.model.data[instance.modelVersion];
    const ports = modelData?.ports || {};

    const inputCount = Object.values(ports).filter((port: any) => port.direction === 'left').length;
    const outputCount = Object.values(ports).filter((port: any) => port.direction === 'right').length;
    const maxPorts = Math.max(inputCount, outputCount, 1);

    const nodeHeight = Math.max(80, 40 + maxPorts * 20);

    const node: Node<FlowNodeData> = {
      id: instance.hierarchy,
      type: 'custom',
      position: {
        x: (index % 4) * 250,
        y: Math.floor(index / 4) * (nodeHeight + 40)
      },
      data: {
        instance,
      },
      style: {
        width: 200,
        height: nodeHeight,
      },
    };

    nodes.push(node);
  });

  return nodes;
}

function createEdgesFromBindings(rootInstance: IPInstance): Edge[] {
  const edges: Edge[] = [];
  const allInstances = getAllInstances(rootInstance);

  const processInstance = (instance: IPInstance) => {
    if (instance.bindings && Array.isArray(instance.bindings)) {
      instance.bindings.forEach((binding: any, index: number) => {
        if (binding.to && binding.from) {
          let targetId = '';
          let targetHandle = '';

          if (binding.to.includes('->')) {
            const [targetInstance, port] = binding.to.split('->');
            const target = allInstances.find(inst => inst.name === targetInstance);
            if (target) {
              targetId = target.hierarchy;
              targetHandle = port;
            }
          }

          if (targetId && targetId !== instance.hierarchy) {
            const edge: Edge = {
              id: `${instance.hierarchy}-${index}`,
              source: instance.hierarchy,
              target: targetId,
              sourceHandle: binding.from,
              targetHandle: targetHandle,
              style: {
                stroke: '#5E8FDE',
                strokeWidth: 2,
                strokeDasharray: '0'
              },
              type: 'smoothstep',
            };

            edges.push(edge);
          }
        }
      });
    }

    instance.children.forEach(child => processInstance(child));
  };

  processInstance(rootInstance);

  return edges;
}

export default function IPInstanceFlowPanel({ rootInstance }: IPInstanceFlowPanelProps) {
  const { setSelectedBinding } = useExplorer();
  const [portVisibility, setPortVisibility] = useState<Record<string, boolean>>({});

  const togglePorts = useCallback((nodeId: string) => {
    setPortVisibility(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  }, []);

  const initialNodes = createNodesFromInstances(rootInstance);
  const initialEdges = createEdgesFromBindings(rootInstance);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isPortsVisible: portVisibility[node.id] ?? true,
        onTogglePorts: () => togglePorts(node.id)
      }
    }))
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    // Create binding object from edge data
    const binding: IPInstanceBinding = {
      from: `${edge.source}.${edge.sourceHandle || ''}`,
      to: `${edge.target}.${edge.targetHandle || ''}`,
      properties: {}
    };

    setSelectedBinding(binding);

    // Switch to edge tab
    if (typeof window !== 'undefined' && (window as any).selectBinding) {
      (window as any).selectBinding(binding);
    }
  }, [setSelectedBinding]);

  // Update nodes when port visibility changes
  const updatedNodes = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      isPortsVisible: portVisibility[node.id] ?? true,
      onTogglePorts: () => togglePorts(node.id)
    }
  }));

  // Filter edges based on port visibility
  const visibleEdges = edges.filter(edge => {
    const sourceVisible = portVisibility[edge.source] ?? true;
    const targetVisible = portVisibility[edge.target] ?? true;
    return sourceVisible && targetVisible;
  });

  return (
    <div className="w-full h-full bg-background border border-bd">
      <div className="p-3 border-b border-bd">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-txt">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Connection Flow
        </h2>
      </div>
      <div className="h-[calc(100%-60px)]">
        <ReactFlow
          nodes={updatedNodes}
          edges={visibleEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          style={{ background: '#2a1065' }}
        >
          <Controls style={{ background: '#1A222D', border: '1px solid #21262D' }} />
          <MiniMap
            style={{ background: '#1A222D', border: '1px solid #21262D' }}
            nodeColor="#5E8FDE"
            maskColor="rgba(42, 16, 101, 0.8)"
          />
          <Background color="#4a2d7a" gap={20} />
        </ReactFlow>
      </div>
    </div>
  );
}