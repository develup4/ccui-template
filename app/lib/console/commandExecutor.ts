import { IPInstance } from '@/app/sample-data';
import { IPInstanceBinding, IPInstancePort } from '@/app/data-structure';

export type CommandContext = {
  rootInstance: IPInstance;
  currentInstance: IPInstance | null;
  currentPort: IPInstancePort | null;
  currentBinding: IPInstanceBinding | null;
  setSelectedNode: (node: IPInstance | null) => void;
  setSelectedPort: (port: IPInstancePort | null) => void;
  setSelectedBinding: (binding: IPInstanceBinding | null) => void;
  reactFlowInstance?: any;
  portVisibility?: Record<string, boolean>;
  setPortVisibility?: (visibility: Record<string, boolean>) => void;
};

export type CommandResult = {
  success: boolean;
  output: string;
  data?: any;
};

// Helper: Find instance by hierarchy pattern
export function findInstance(root: IPInstance, hierarchy: string): IPInstance | null {
  if (root.hierarchy === hierarchy) return root;
  for (const child of root.children) {
    const found = findInstance(child, hierarchy);
    if (found) return found;
  }
  return null;
}

// Helper: Get all instances recursively with optional pattern matching
export function getAllInstances(instance: IPInstance, pattern?: string): IPInstance[] {
  let instances = [instance];
  instance.children.forEach(child => {
    instances.push(...getAllInstances(child));
  });

  if (pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    instances = instances.filter(inst => regex.test(inst.hierarchy));
  }

  return instances;
}

// Helper: Get all bindings from instance tree
export function getAllBindings(instance: IPInstance): Array<{instance: IPInstance, binding: any, index: number}> {
  const result: Array<{instance: IPInstance, binding: any, index: number}> = [];

  if (instance.bindings && Array.isArray(instance.bindings)) {
    instance.bindings.forEach((binding, index) => {
      result.push({ instance, binding, index });
    });
  }

  instance.children.forEach(child => {
    result.push(...getAllBindings(child));
  });

  return result;
}

// Helper: Parse command arguments (handles flags like -filter, -hierarchical, etc)
export function parseArgs(argsStr: string): { args: string[], flags: Record<string, string> } {
  const tokens = argsStr.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  const args: string[] = [];
  const flags: Record<string, string> = {};

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].replace(/^"|"$/g, ''); // Remove quotes

    if (token.startsWith('-')) {
      const flagName = token.substring(1);
      const nextToken = tokens[i + 1];

      if (nextToken && !nextToken.startsWith('-')) {
        flags[flagName] = nextToken.replace(/^"|"$/g, '');
        i++;
      } else {
        flags[flagName] = 'true';
      }
    } else {
      args.push(token);
    }
  }

  return { args, flags };
}

// Command Registry
const commands: Record<string, (args: string[], flags: Record<string, string>, ctx: CommandContext) => CommandResult> = {

  // === Instance Commands ===
  get_instances: (args, flags, ctx) => {
    const pattern = flags.hierarchical || args[0] || '*';
    let instances = getAllInstances(ctx.rootInstance, pattern);

    if (flags.filter) {
      // Simple filter: {property == "value"}
      const match = flags.filter.match(/\{(.+?)\s*(==|!=)\s*"?(.+?)"?\}/);
      if (match) {
        const [, path, op, value] = match;
        instances = instances.filter(inst => {
          const keys = path.split('.');
          let current: any = inst;
          for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
              current = current[key];
            } else {
              return false;
            }
          }
          if (op === '==') return String(current) === value;
          if (op === '!=') return String(current) !== value;
          return true;
        });
      }
    }

    const output = instances.map(inst => inst.hierarchy).join('\n');
    return { success: true, output: output || '(no instances found)', data: instances };
  },

  get_instance: (args, flags, ctx) => {
    if (args.length === 0) {
      return { success: false, output: 'Error: Usage: get_instance <hierarchy>' };
    }

    const instance = findInstance(ctx.rootInstance, args[0]);
    if (!instance) {
      return { success: false, output: `Error: Instance not found: ${args[0]}` };
    }

    return { success: true, output: instance.hierarchy, data: instance };
  },

  current_instance: (args, flags, ctx) => {
    if (args.length === 0) {
      return {
        success: true,
        output: ctx.currentInstance?.hierarchy || '(none)',
        data: ctx.currentInstance
      };
    }

    const instance = findInstance(ctx.rootInstance, args[0]);
    if (!instance) {
      return { success: false, output: `Error: Instance not found: ${args[0]}` };
    }

    ctx.setSelectedNode(instance);
    return { success: true, output: `Current instance set to: ${instance.hierarchy}` };
  },

  // === Property Commands ===
  get_property: (args, flags, ctx) => {
    if (args.length < 2) {
      return { success: false, output: 'Error: Usage: get_property <property_name> <instance_hierarchy>' };
    }

    const propName = args[0];
    const instance = findInstance(ctx.rootInstance, args[1]);

    if (!instance) {
      return { success: false, output: `Error: Instance not found: ${args[1]}` };
    }

    const value = instance.data?.properties?.[propName];
    if (value === undefined) {
      return { success: false, output: `Error: Property not found: ${propName}` };
    }

    return { success: true, output: String(value), data: value };
  },

  set_property: (args, flags, ctx) => {
    if (args.length < 3) {
      return { success: false, output: 'Error: Usage: set_property <property_name> <value> <instance_hierarchy>' };
    }

    const propName = args[0];
    let propValue: any = args[1];
    const instance = findInstance(ctx.rootInstance, args[2]);

    if (!instance) {
      return { success: false, output: `Error: Instance not found: ${args[2]}` };
    }

    // Parse value
    if (propValue === 'true') propValue = true;
    else if (propValue === 'false') propValue = false;
    else if (!isNaN(Number(propValue)) && !propValue.startsWith('0x')) propValue = Number(propValue);

    if (!instance.data) instance.data = { properties: {} };
    if (!instance.data.properties) instance.data.properties = {};

    instance.data.properties[propName] = propValue;
    ctx.setSelectedNode(instance); // Trigger update

    return { success: true, output: `Property ${propName} set to ${propValue} on ${instance.hierarchy}` };
  },

  list_property: (args, flags, ctx) => {
    if (args.length === 0) {
      return { success: false, output: 'Error: Usage: list_property <instance_hierarchy>' };
    }

    const instance = findInstance(ctx.rootInstance, args[0]);
    if (!instance) {
      return { success: false, output: `Error: Instance not found: ${args[0]}` };
    }

    const properties = instance.data?.properties || {};
    const output = Object.entries(properties)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    return { success: true, output: output || '(no properties)', data: properties };
  },

  // === Binding Commands ===
  create_binding: (args, flags, ctx) => {
    if (!flags.from || !flags.to) {
      return { success: false, output: 'Error: Usage: create_binding -from <source> -to <target>' };
    }

    const fromParts = flags.from.split(/[.\->]+/);
    const toParts = flags.to.split(/[.\->]+/);

    if (fromParts.length < 2 || toParts.length < 2) {
      return { success: false, output: 'Error: Invalid from/to format. Use: instance.port' };
    }

    const fromHierarchy = fromParts.slice(0, -1).join('.');
    const fromPort = fromParts[fromParts.length - 1];
    const toHierarchy = toParts.slice(0, -1).join('.');
    const toPort = toParts[toParts.length - 1];

    const fromInstance = findInstance(ctx.rootInstance, fromHierarchy);
    const toInstance = findInstance(ctx.rootInstance, toHierarchy);

    if (!fromInstance) {
      return { success: false, output: `Error: Source instance not found: ${fromHierarchy}` };
    }
    if (!toInstance) {
      return { success: false, output: `Error: Target instance not found: ${toHierarchy}` };
    }

    if (!fromInstance.bindings) fromInstance.bindings = [];

    const binding = {
      from: fromPort,
      to: `${toInstance.name}->${toPort}`,
      properties: {}
    };

    fromInstance.bindings.push(binding);
    ctx.setSelectedNode(fromInstance);

    return { success: true, output: `Binding created: ${flags.from} -> ${flags.to}` };
  },

  get_bindings: (args, flags, ctx) => {
    let bindings = getAllBindings(ctx.rootInstance);

    if (flags.of_objects) {
      const instance = findInstance(ctx.rootInstance, flags.of_objects);
      if (instance) {
        bindings = getAllBindings(instance);
      }
    }

    if (flags.from) {
      bindings = bindings.filter(b => {
        const fullFrom = `${b.instance.hierarchy}.${b.binding.from}`;
        return fullFrom.includes(flags.from);
      });
    }

    const output = bindings.map(b =>
      `${b.instance.hierarchy}.${b.binding.from} -> ${b.binding.to}`
    ).join('\n');

    return { success: true, output: output || '(no bindings)', data: bindings };
  },

  // === Selection/Navigation Commands ===
  select_objects: (args, flags, ctx) => {
    if (args.length === 0) {
      return { success: false, output: 'Error: Usage: select_objects <instance_hierarchy>' };
    }

    const instance = findInstance(ctx.rootInstance, args[0]);
    if (!instance) {
      return { success: false, output: `Error: Instance not found: ${args[0]}` };
    }

    ctx.setSelectedNode(instance);
    return { success: true, output: `Selected: ${instance.hierarchy}` };
  },

  zoom_to: (args, flags, ctx) => {
    if (args.length === 0) {
      return { success: false, output: 'Error: Usage: zoom_to <instance_hierarchy>' };
    }

    const instance = findInstance(ctx.rootInstance, args[0]);
    if (!instance) {
      return { success: false, output: `Error: Instance not found: ${args[0]}` };
    }

    ctx.setSelectedNode(instance);

    if (ctx.reactFlowInstance) {
      setTimeout(() => {
        ctx.reactFlowInstance.fitView({
          nodes: [{ id: instance.hierarchy }],
          duration: 300,
          padding: 0.5
        });
      }, 100);
    }

    return { success: true, output: `Zoomed to: ${instance.hierarchy}` };
  },

  show_ports: (args, flags, ctx) => {
    if (args.length === 0) {
      return { success: false, output: 'Error: Usage: show_ports <instance_hierarchy>' };
    }

    const instance = findInstance(ctx.rootInstance, args[0]);
    if (!instance) {
      return { success: false, output: `Error: Instance not found: ${args[0]}` };
    }

    if (ctx.setPortVisibility && ctx.portVisibility) {
      ctx.setPortVisibility({ ...ctx.portVisibility, [instance.hierarchy]: true });
    }

    return { success: true, output: `Ports shown for: ${instance.hierarchy}` };
  },

  hide_ports: (args, flags, ctx) => {
    if (args.length === 0) {
      return { success: false, output: 'Error: Usage: hide_ports <instance_hierarchy>' };
    }

    const instance = findInstance(ctx.rootInstance, args[0]);
    if (!instance) {
      return { success: false, output: `Error: Instance not found: ${args[0]}` };
    }

    if (ctx.setPortVisibility && ctx.portVisibility) {
      ctx.setPortVisibility({ ...ctx.portVisibility, [instance.hierarchy]: false });
    }

    return { success: true, output: `Ports hidden for: ${instance.hierarchy}` };
  },

  // === Help Command ===
  help: (args, flags, ctx) => {
    const helpText = `
Available Commands:

Instance Management:
  get_instances [-hierarchical <pattern>] [-filter {expr}]
  get_instance <hierarchy>
  current_instance [<hierarchy>]

Property Management:
  get_property <name> <hierarchy>
  set_property <name> <value> <hierarchy>
  list_property <hierarchy>

Binding Management:
  create_binding -from <source> -to <target>
  get_bindings [-of_objects <hierarchy>] [-from <pattern>]

Selection & Navigation:
  select_objects <hierarchy>
  zoom_to <hierarchy>
  show_ports <hierarchy>
  hide_ports <hierarchy>

Examples:
  get_instances root.*
  set_property clock_speed 3.0 root.cpu_cluster.core0
  create_binding -from root.cpu.out -to root.mem.in
    `.trim();

    return { success: true, output: helpText };
  },
};

export function executeCommand(commandStr: string, ctx: CommandContext): CommandResult {
  const trimmed = commandStr.trim();
  if (!trimmed) {
    return { success: false, output: '' };
  }

  // Split command and arguments
  const firstSpace = trimmed.indexOf(' ');
  const cmdName = firstSpace === -1 ? trimmed : trimmed.substring(0, firstSpace);
  const argsStr = firstSpace === -1 ? '' : trimmed.substring(firstSpace + 1);

  const { args, flags } = parseArgs(argsStr);

  const command = commands[cmdName];
  if (!command) {
    return { success: false, output: `Error: Unknown command: ${cmdName}` };
  }

  try {
    return command(args, flags, ctx);
  } catch (error) {
    return { success: false, output: `Error: ${(error as Error).message}` };
  }
}

// Export command to log GUI actions
export function logGuiAction(action: string): void {
  if (typeof window !== 'undefined' && (window as any).logConsoleCommand) {
    (window as any).logConsoleCommand(action);
  }
}
