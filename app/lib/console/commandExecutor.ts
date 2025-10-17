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

// Helper: Parse bind command format
// Format: bind {node}->{port}=>{node}->{port}
// Shorthand: bind {port}=>{node}->{port} (from parent)
// Shorthand: bind {node}->{port}=>{port} (to parent)
// Multiple: bind a->p1=>b->p1; b->p2=>p3; c->p4=>a->p1
export type BindingParsed = {
  fromNode?: string;  // undefined if connecting from parent
  fromPort: string;
  toNode?: string;    // undefined if connecting to parent
  toPort: string;
};

export function parseBindCommand(bindStr: string): BindingParsed | null {
  // Remove whitespace
  const cleaned = bindStr.trim();

  // Split by =>
  const parts = cleaned.split('=>');
  if (parts.length !== 2) {
    return null;
  }

  const [leftSide, rightSide] = parts;

  // Parse left side (from)
  let fromNode: string | undefined;
  let fromPort: string;

  if (leftSide.includes('->')) {
    const leftParts = leftSide.split('->');
    fromNode = leftParts[0].trim();
    fromPort = leftParts[1].trim();
  } else {
    // No node specified, means from parent
    fromPort = leftSide.trim();
  }

  // Parse right side (to)
  let toNode: string | undefined;
  let toPort: string;

  if (rightSide.includes('->')) {
    const rightParts = rightSide.split('->');
    toNode = rightParts[0].trim();
    toPort = rightParts[1].trim();
  } else {
    // No node specified, means to parent
    toPort = rightSide.trim();
  }

  return {
    fromNode,
    fromPort,
    toNode,
    toPort
  };
}

// Helper: Parse multiple bind commands separated by semicolon
export function parseMultipleBindCommands(bindStr: string): BindingParsed[] {
  // Split by semicolon
  const bindings = bindStr.split(';').map(s => s.trim()).filter(s => s.length > 0);

  const results: BindingParsed[] = [];

  for (const binding of bindings) {
    const parsed = parseBindCommand(binding);
    if (parsed) {
      results.push(parsed);
    }
  }

  return results;
}

// Command Registry
const commands: Record<string, (args: string[], flags: Record<string, string>, ctx: CommandContext) => CommandResult> = {

  // === Binding Commands ===
  bind: (args, flags, ctx) => {
    if (args.length === 0) {
      return { success: false, output: 'Error: Usage: bind {node}->{port}=>{node}->{port}' };
    }

    const bindStr = args.join(' ');
    const parsedBindings = parseMultipleBindCommands(bindStr);

    if (parsedBindings.length === 0) {
      return { success: false, output: 'Error: Invalid bind format. Use: {node}->{port}=>{node}->{port}' };
    }

    // TODO: Implement actual binding logic
    // For now, just show what was parsed
    const outputLines = parsedBindings.map((parsed, index) => {
      const fromStr = parsed.fromNode ? `${parsed.fromNode}->` : '(parent)->';
      const toStr = parsed.toNode ? `${parsed.toNode}->` : '(parent)->';
      return `  [${index + 1}] ${fromStr}${parsed.fromPort} => ${toStr}${parsed.toPort}`;
    });

    const output = `Parsed ${parsedBindings.length} binding(s):
${outputLines.join('\n')}

(Actual binding creation not yet implemented)`;

    return { success: true, output, data: parsedBindings };
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

  // === Help Command ===
  help: (args, flags, ctx) => {
    const helpText = `
Available Commands:

Binding Management:
  bind {node}->{port}=>{node}->{port}
    - Full format: bind cpu->out=>mem->in
    - From parent: bind out=>mem->in
    - To parent: bind cpu->out=>in
    - Multiple: bind a->p1=>b->p1; b->p2=>p3; c->p4=>a->p1

  get_bindings [-of_objects <hierarchy>] [-from <pattern>]

Examples:
  bind cpu->out=>mem->in
  bind out=>child1->in
  bind child2->out=>in
  bind "a->p1=>b->p1; b->p2=>p3"
  get_bindings
  get_bindings -of_objects root.cpu
  get_bindings -from root.cpu
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
