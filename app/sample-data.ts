export interface IPInstance {
  id: number;
  name: string;
  hierarchy: string;
  model: IPModel;
  modelId: number;
  modelVersion: string;
  parent?: IPInstance;
  parentId?: number;
  children: IPInstance[];
  bindings: any;
  data: any;
  memo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPModel {
  id: number;
  type: string;
  isSystem: boolean;
  isComposite: boolean;
  isCustom: boolean;
  data: any;
  ownerGroupId: number;
  deleteFlag: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const sampleIPInstanceHierarchy: IPInstance = {
  id: 1,
  name: "System Root",
  hierarchy: "root",
  modelId: 1,
  modelVersion: "1.0",
  model: {
    id: 1,
    type: "SystemRoot",
    isSystem: true,
    isComposite: false,
    isCustom: false,
    data: {
      "1.0": {
        properties: {
          "sys_clock_freq": {
            type: "Number",
            description: "System clock frequency in MHz",
            constraint: { type: "range", value: { from: 50, to: 1000 } },
            defaultValue: 100,
            tag: "hw"
          },
          "debug_mode": {
            type: "Boolean",
            description: "Enable debug mode for system",
            constraint: { type: "None", value: "None" },
            defaultValue: false,
            tag: "sim"
          }
        },
        display: {
          size: { width: 100, height: 80 },
          color: { port: "#ffffff", title: "#000000", titleFont: "Arial", primary: "#0066cc" },
          emoji: "🖥️"
        },
        cModelLib: { nca: true, ia: false }
      }
    },
    ownerGroupId: 1,
    deleteFlag: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  children: [
    {
      id: 2,
      name: "CPU Cluster",
      hierarchy: "root.cpu_cluster",
      modelId: 2,
      modelVersion: "2.0",
      parentId: 1,
      model: {
        id: 2,
        type: "CPUCluster",
        isSystem: false,
        isComposite: true,
        isCustom: false,
        data: {
          "2.0": {
            properties: {
              "core_count": {
                type: "String Select",
                description: "Number of CPU cores in cluster",
                constraint: { type: "list", value: ["2", "4", "8", "16"] },
                defaultValue: "4",
                tag: "hw"
              },
              "cache_size": {
                type: "Address",
                description: "L2 cache size",
                constraint: { type: "range", value: { from: "0x00100000", to: "0x01000000" } },
                defaultValue: "0x00400000",
                tag: "hw"
              },
              "power_mode": {
                type: "String Select",
                description: "Power management mode",
                constraint: { type: "list", value: ["performance", "balanced", "power_save"] },
                defaultValue: "balanced",
                tag: "sim"
              }
            },
            display: {
              size: { width: 120, height: 90 },
              color: { port: "#ffffff", title: "#000000", titleFont: "Arial", primary: "#00aa44" },
              emoji: "⚡"
            },
            cModelLib: { nca: false, ia: true }
          }
        },
        ownerGroupId: 1,
        deleteFlag: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      children: [
        {
          id: 3,
          name: "ARM Cortex-A78",
          hierarchy: "root.cpu_cluster.core0",
          modelId: 3,
          modelVersion: "1.5",
          parentId: 2,
          model: {
            id: 3,
            type: "ARMCortexA78",
            isSystem: false,
            isComposite: false,
            isCustom: false,
            data: {},
            ownerGroupId: 1,
            deleteFlag: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          children: [],
          bindings: {},
          data: {},
          memo: "High-performance CPU core",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "ARM Cortex-A78",
          hierarchy: "root.cpu_cluster.core1",
          modelId: 3,
          modelVersion: "1.5",
          parentId: 2,
          model: {
            id: 3,
            type: "ARMCortexA78",
            isSystem: false,
            isComposite: false,
            isCustom: false,
            data: {},
            ownerGroupId: 1,
            deleteFlag: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          children: [],
          bindings: {},
          data: {},
          memo: "High-performance CPU core",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      bindings: {},
      data: {
        properties: {
          "core_count": "8",
          "cache_size": "0x00800000",
          "power_mode": "performance"
        }
      },
      memo: "Multi-core CPU cluster",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      name: "Memory Subsystem",
      hierarchy: "root.memory",
      modelId: 4,
      modelVersion: "3.0",
      parentId: 1,
      model: {
        id: 4,
        type: "MemoryController",
        isSystem: true,
        isComposite: true,
        isCustom: false,
        data: {},
        ownerGroupId: 1,
        deleteFlag: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      children: [
        {
          id: 6,
          name: "DDR4 Controller",
          hierarchy: "root.memory.ddr4_ctrl",
          modelId: 5,
          modelVersion: "2.1",
          parentId: 5,
          model: {
            id: 5,
            type: "DDR4Controller",
            isSystem: false,
            isComposite: false,
            isCustom: true,
            data: {},
            ownerGroupId: 1,
            deleteFlag: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          children: [],
          bindings: {},
          data: {},
          memo: "Custom DDR4 memory controller",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      bindings: {},
      data: {},
      memo: "Memory management subsystem",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 7,
      name: "IO Subsystem",
      hierarchy: "root.io",
      modelId: 6,
      modelVersion: "1.0",
      parentId: 1,
      model: {
        id: 6,
        type: "IOController",
        isSystem: false,
        isComposite: true,
        isCustom: true,
        data: {},
        ownerGroupId: 1,
        deleteFlag: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      children: [
        {
          id: 8,
          name: "UART Controller",
          hierarchy: "root.io.uart",
          modelId: 7,
          modelVersion: "1.2",
          parentId: 7,
          model: {
            id: 7,
            type: "UARTController",
            isSystem: true,
            isComposite: false,
            isCustom: false,
            data: {},
            ownerGroupId: 1,
            deleteFlag: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          children: [],
          bindings: {},
          data: {},
          memo: "Serial communication controller",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          name: "GPIO Controller",
          hierarchy: "root.io.gpio",
          modelId: 8,
          modelVersion: "2.0",
          parentId: 7,
          model: {
            id: 8,
            type: "GPIOController",
            isSystem: false,
            isComposite: false,
            isCustom: true,
            data: {},
            ownerGroupId: 1,
            deleteFlag: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          children: [],
          bindings: {},
          data: {},
          memo: "General purpose IO controller",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      bindings: {},
      data: {},
      memo: "Input/Output subsystem",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  bindings: {},
  data: {
    properties: {
      "sys_clock_freq": 200,
      "debug_mode": true
    }
  },
  memo: "Root system instance",
  createdAt: new Date(),
  updatedAt: new Date(),
};