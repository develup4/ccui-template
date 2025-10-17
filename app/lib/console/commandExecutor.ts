import { CreateBindingCommand, parseMultipleBindCommands, commandHistory } from './commandHistory';
import { sampleIPInstanceHierarchy } from '@/app/sample-data';

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

History Management:
  undo - Undo last command
  redo - Redo last undone command
  history - Show command history

Console Management:
  help - Show this help message
  clear - Clear console output

Examples:
  bind cpu->out=>mem->in
  bind out=>child1->in
  bind child2->out=>in
  bind a->p1=>b->p1; b->p2=>p3; c->p4=>a->p1
  undo
  redo
  history
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

    // Execute each binding as a command
    const results: string[] = [];
    try {
      for (const bindStr of bindStr.split(';').map(s => s.trim()).filter(s => s.length > 0)) {
        const cmd = new CreateBindingCommand(sampleIPInstanceHierarchy, bindStr);
        commandHistory.executeCommand(cmd);
        results.push(cmd.getBindingInfo());
      }
      return { success: true, output: results.join('\n') };
    } catch (error) {
      return { success: false, output: `Error: ${(error as Error).message}` };
    }
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
