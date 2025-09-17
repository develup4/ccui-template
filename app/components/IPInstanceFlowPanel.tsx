'use client';

import { useCallback } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { IPInstance } from '../sample-data';

interface IPInstanceFlowPanelProps {
  rootInstance: IPInstance;
}

interface FlowNodeData {
  instance: IPInstance;
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
  const { instance } = data;
  const modelData = instance.model.data[instance.modelVersion];
  const display = modelData?.display;
  const ports = modelData?.ports || {};

  const inputPorts = Object.entries(ports).filter(([_, port]: [string, any]) =>
    port.direction === 'left'
  );
  const outputPorts = Object.entries(ports).filter(([_, port]: [string, any]) =>
    port.direction === 'right'
  );

  return (
    <div
      className="relative rounded-lg border-2 border-gray-600 bg-gray-800 min-w-[200px]"
      style={{
        background: 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
      }}
    >
      <div
        className="px-3 py-2 rounded-t-md text-white text-sm font-semibold flex items-center gap-2"
        style={{ backgroundColor: display?.color?.primary || '#555555' }}
      >
        <span>{display?.emoji || '📦'}</span>
        <span>{instance.name}</span>
        <span className="ml-auto text-xs opacity-75">{instance.model.type}</span>
      </div>

      <div className="p-3 space-y-1">
        {inputPorts.map(([portName, portData]: [string, any], index) => (
          <div key={`input-${portName}`} className="flex items-center gap-2 text-xs text-gray-300">
            <Handle
              type="target"
              position={Position.Left}
              id={portName}
              style={{
                background: getPortColor(portData.type),
                border: '2px solid #333',
                width: '12px',
                height: '12px',
                left: '-6px',
                top: `${45 + index * 20}px`
              }}
            />
            <div
              className="w-3 h-3 rounded-full border border-gray-500"
              style={{ backgroundColor: getPortColor(portData.type) }}
            />
            <span className="text-gray-300">{portName}</span>
          </div>
        ))}

        {outputPorts.map(([portName, portData]: [string, any], index) => (
          <div key={`output-${portName}`} className="flex items-center justify-end gap-2 text-xs text-gray-300">
            <span className="text-gray-300">{portName}</span>
            <div
              className="w-3 h-3 rounded-full border border-gray-500"
              style={{ backgroundColor: getPortColor(portData.type) }}
            />
            <Handle
              type="source"
              position={Position.Right}
              id={portName}
              style={{
                background: getPortColor(portData.type),
                border: '2px solid #333',
                width: '12px',
                height: '12px',
                right: '-6px',
                top: `${45 + index * 20}px`
              }}
            />
          </div>
        ))}
      </div>
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
  const initialNodes = createNodesFromInstances(rootInstance);
  const initialEdges = createEdgesFromBindings(rootInstance);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

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
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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