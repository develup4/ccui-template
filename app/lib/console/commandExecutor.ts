export type CommandResult = {
  success: boolean;
  output: string;
};

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
const commands: Record<string, (args: string[], flags: Record<string, string>) => CommandResult> = {

  // === Help Command ===
  help: (args, flags) => {
    const helpText = `
Available Commands:

Binding Management:
  bind {node}->{port}=>{node}->{port}

  Format Rules:
    - Full format: {node}->{port}=>{node}->{port}
    - From parent: {port}=>{node}->{port} (omit source node)
    - To parent: {node}->{port}=>{port} (omit target node)
    - Multiple bindings: Use semicolon (;) to separate
    - Spaces are optional around arrows and separators

Console Management:
  help - Show this help message
  clear - Clear console output

Examples:
  bind cpu->out=>mem->in
  bind out=>child1->in
  bind child2->out=>in
  bind a->p1=>b->p1; b->p2=>p3; c->p4=>a->p1
  help
  clear
    `.trim();

    return { success: true, output: helpText };
  },

  // === Clear Command ===
  clear: (args, flags) => {
    return { success: true, output: '' };
  },

  // === Bind Command ===
  bind: (args, flags) => {
    if (args.length === 0) {
      return { success: false, output: 'Error: Usage: bind {node}->{port}=>{node}->{port}' };
    }

    const bindStr = args.join(' ');
    const parsedBindings = parseMultipleBindCommands(bindStr);

    if (parsedBindings.length === 0) {
      return { success: false, output: 'Error: Invalid bind format. Use: {node}->{port}=>{node}->{port}' };
    }

    // Only validate parsing, don't execute
    const results = parsedBindings.map(p => {
      const from = p.fromNode ? `${p.fromNode}->${p.fromPort}` : p.fromPort;
      const to = p.toNode ? `${p.toNode}->${p.toPort}` : p.toPort;
      return `Parsed: ${from} => ${to}`;
    });

    return { success: true, output: results.join('\n') };
  },
};

export function executeCommand(commandStr: string): CommandResult {
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
    return command(args, flags);
  } catch (error) {
    return { success: false, output: `Error: ${(error as Error).message}` };
  }
}
