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
        ports: {
          clock: {
            type: "clock",
            source: [{type: "*", portType: "*"}],
            direction: "right"
          },
          reset: {
            type: "signal",
            source: [{type: "*", portType: "*"}],
            direction: "right"
          }
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
            data: {
              "1.5": {
                properties: {
                  "clock_speed": {
                    type: "Number",
                    description: "CPU core clock speed in GHz",
                    constraint: { type: "range", value: { from: 1.0, to: 3.5 } },
                    defaultValue: 2.8,
                    tag: "hw"
                  },
                  "power_state": {
                    type: "String Select",
                    description: "Core power state",
                    constraint: { type: "list", value: ["active", "idle", "sleep"] },
                    defaultValue: "active",
                    tag: "sim"
                  }
                },
                display: {
                  size: { width: 80, height: 60 },
                  color: { port: "#ffffff", title: "#000000", titleFont: "Arial", primary: "#ff6600" },
                  emoji: "🔥"
                },
                cModelLib: { nca: false, ia: false }
              }
            },
            ownerGroupId: 1,
            deleteFlag: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          children: [],
          bindings: [
            {"to": "heart->clock", "from": "clock"}
          ],
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
            data: {
              "1.5": {
                properties: {
                  "clock_speed": {
                    type: "Number",
                    description: "CPU core clock speed in GHz",
                    constraint: { type: "range", value: { from: 1.0, to: 3.5 } },
                    defaultValue: 2.8,
                    tag: "hw"
                  },
                  "power_state": {
                    type: "String Select",
                    description: "Core power state",
                    constraint: { type: "list", value: ["active", "idle", "sleep"] },
                    defaultValue: "active",
                    tag: "sim"
                  }
                },
                display: {
                  size: { width: 80, height: 60 },
                  color: { port: "#ffffff", title: "#000000", titleFont: "Arial", primary: "#ff6600" },
                  emoji: "🔥"
                },
                cModelLib: { nca: false, ia: false }
              }
            },
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
        data: {
          "3.0": {
            properties: {
              "memory_size": {
                type: "Address",
                description: "Total memory size",
                constraint: { type: "range", value: { from: "0x10000000", to: "0x80000000" } },
                defaultValue: "0x40000000",
                tag: "hw"
              },
              "refresh_rate": {
                type: "Number",
                description: "Memory refresh rate in Hz",
                constraint: { type: "range", value: { from: 60, to: 120 } },
                defaultValue: 64,
                tag: "hw"
              }
            },
            display: {
              size: { width: 100, height: 80 },
              color: { port: "#ffffff", title: "#000000", titleFont: "Arial", primary: "#9966cc" },
              emoji: "💾"
            },
            cModelLib: { nca: true, ia: true }
          }
        },
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
            data: {
              "2.1": {
                properties: {
                  "data_width": {
                    type: "String Select",
                    description: "Data bus width",
                    constraint: { type: "list", value: ["32", "64", "128"] },
                    defaultValue: "64",
                    tag: "hw"
                  },
                  "ecc_enabled": {
                    type: "Boolean",
                    description: "Error correction code enabled",
                    constraint: { type: "None", value: "None" },
                    defaultValue: true,
                    tag: "hw"
                  }
                },
                display: {
                  size: { width: 90, height: 70 },
                  color: { port: "#ffffff", title: "#000000", titleFont: "Arial", primary: "#cc3366" },
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
        data: {
          "1.0": {
            properties: {
              "port_count": {
                type: "Number",
                description: "Number of IO ports",
                constraint: { type: "range", value: { from: 4, to: 32 } },
                defaultValue: 16,
                tag: "hw"
              },
              "voltage_level": {
                type: "String Select",
                description: "IO voltage level",
                constraint: { type: "list", value: ["1.8V", "3.3V", "5V"] },
                defaultValue: "3.3V",
                tag: "hw"
              }
            },
            display: {
              size: { width: 110, height: 85 },
              color: { port: "#ffffff", title: "#000000", titleFont: "Arial", primary: "#66cc99" },
              emoji: "🔌"
            },
            cModelLib: { nca: false, ia: false }
          }
        },
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
            data: {
              "1.2": {
                properties: {
                  "baud_rate": {
                    type: "String Select",
                    description: "UART baud rate",
                    constraint: { type: "list", value: ["9600", "115200", "921600"] },
                    defaultValue: "115200",
                    tag: "hw"
                  },
                  "parity": {
                    type: "String Select",
                    description: "Parity check mode",
                    constraint: { type: "list", value: ["none", "even", "odd"] },
                    defaultValue: "none",
                    tag: "hw"
                  }
                },
                display: {
                  size: { width: 85, height: 65 },
                  color: { port: "#ffffff", title: "#000000", titleFont: "Arial", primary: "#3399ff" },
                  emoji: "📡"
                },
                cModelLib: { nca: true, ia: false }
              }
            },
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
            data: {
              "2.0": {
                properties: {
                  "pin_count": {
                    type: "Number",
                    description: "Number of GPIO pins",
                    constraint: { type: "range", value: { from: 8, to: 64 } },
                    defaultValue: 32,
                    tag: "hw"
                  },
                  "interrupt_support": {
                    type: "Boolean",
                    description: "Interrupt support enabled",
                    constraint: { type: "None", value: "None" },
                    defaultValue: true,
                    tag: "hw"
                  },
                  "pull_up_config": {
                    type: "Complex",
                    description: "Pull-up resistor configuration",
                    constraint: { type: "None", value: "None" },
                    defaultValue: { "enabled": true, "resistance": "10k" },
                    tag: "hw"
                  }
                },
                display: {
                  size: { width: 95, height: 75 },
                  color: { port: "#ffffff", title: "#000000", titleFont: "Arial", primary: "#ff9900" },
                  emoji: "🔗"
                },
                cModelLib: { nca: false, ia: true }
              }
            },
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
    },
    {
      id: 10,
      name: "heart",
      hierarchy: "root.heart",
      modelId: 9,
      modelVersion: "1.0",
      parentId: 1,
      model: {
        id: 9,
        type: "HeartController",
        isSystem: false,
        isComposite: false,
        isCustom: true,
        data: {
          "1.0": {
            properties: {
              "rate": {
                type: "Number",
                description: "Heart rate in BPM",
                constraint: { type: "range", value: { from: 60, to: 200 } },
                defaultValue: 72,
                tag: "hw"
              }
            },
            display: {
              size: { width: 80, height: 60 },
              color: { port: "#ffffff", title: "#000000", titleFont: "Arial", primary: "#ff3366" },
              emoji: "❤️"
            },
            ports: {
              clock: {
                type: "clock",
                source: [{type: "*", portType: "*"}],
                direction: "left"
              },
              beat: {
                type: "signal",
                source: [{type: "*", portType: "*"}],
                direction: "right"
              }
            },
            cModelLib: { nca: false, ia: false }
          }
        },
        ownerGroupId: 1,
        deleteFlag: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      children: [],
      bindings: {},
      data: {},
      memo: "Heart rate controller",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  bindings: [
    {"to": "heart->clock", "from": "clock"}
  ],
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