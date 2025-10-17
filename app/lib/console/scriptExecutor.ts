import { executeCommand, CommandContext } from './commandExecutor';

export type ScriptResult = {
  success: boolean;
  output: string[];
  errors: string[];
};

// Execute multiple commands (script)
export function executeScript(script: string, ctx: CommandContext): ScriptResult {
  const lines = script.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
  const output: string[] = [];
  const errors: string[] = [];

  for (const line of lines) {
    try {
      const result = executeCommand(line, ctx);
      if (result.success) {
        output.push(result.output);
      } else {
        errors.push(result.output);
      }
    } catch (error) {
      errors.push(`Error executing: ${line} - ${(error as Error).message}`);
    }
  }

  return {
    success: errors.length === 0,
    output,
    errors
  };
}

// Parse and execute for loop
// Syntax: for <var> in <list> { <commands> }
// Example: for i in 0 1 2 { set_property value $i root.instance_$i }
export function executeForLoop(loopStr: string, ctx: CommandContext): ScriptResult {
  const match = loopStr.match(/for\s+(\w+)\s+in\s+(.+?)\s+\{(.+?)\}/s);

  if (!match) {
    return {
      success: false,
      output: [],
      errors: ['Invalid for loop syntax. Use: for <var> in <list> { <commands> }']
    };
  }

  const [, varName, listStr, commandsStr] = match;
  const items = listStr.trim().split(/\s+/);
  const output: string[] = [];
  const errors: string[] = [];

  for (const item of items) {
    // Replace variable in commands
    const commands = commandsStr.replace(new RegExp(`\\$${varName}`, 'g'), item);
    const commandLines = commands.split('\n').map(line => line.trim()).filter(line => line);

    for (const cmd of commandLines) {
      try {
        const result = executeCommand(cmd, ctx);
        if (result.success) {
          output.push(result.output);
        } else {
          errors.push(result.output);
        }
      } catch (error) {
        errors.push(`Error in loop (${varName}=${item}): ${(error as Error).message}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    output,
    errors
  };
}

// Parse and execute foreach loop
// Syntax: foreach <var> <list_command> { <commands> }
// Example: foreach inst [get_instances root.*] { show_ports $inst }
export function executeForeachLoop(loopStr: string, ctx: CommandContext): ScriptResult {
  const match = loopStr.match(/foreach\s+(\w+)\s+\[(.+?)\]\s+\{(.+?)\}/s);

  if (!match) {
    return {
      success: false,
      output: [],
      errors: ['Invalid foreach loop syntax. Use: foreach <var> [<list_command>] { <commands> }']
    };
  }

  const [, varName, listCommand, commandsStr] = match;

  // Execute list command to get items
  const listResult = executeCommand(listCommand.trim(), ctx);

  if (!listResult.success) {
    return {
      success: false,
      output: [],
      errors: [`Failed to get list: ${listResult.output}`]
    };
  }

  const items = listResult.data || listResult.output.split('\n').filter((line: string) => line.trim());
  const output: string[] = [];
  const errors: string[] = [];

  for (const item of items) {
    const itemStr = typeof item === 'object' ? item.hierarchy || String(item) : String(item);

    // Replace variable in commands
    const commands = commandsStr.replace(new RegExp(`\\$${varName}`, 'g'), itemStr);
    const commandLines = commands.split('\n').map(line => line.trim()).filter(line => line);

    for (const cmd of commandLines) {
      try {
        const result = executeCommand(cmd, ctx);
        if (result.success) {
          output.push(result.output);
        } else {
          errors.push(result.output);
        }
      } catch (error) {
        errors.push(`Error in foreach (${varName}=${itemStr}): ${(error as Error).message}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    output,
    errors
  };
}

// Parse and execute range-based for loop
// Syntax: for <var> from <start> to <end> { <commands> }
// Example: for i from 0 to 10 { create_binding -from root.src_$i.out -to root.dst_$i.in }
export function executeRangeForLoop(loopStr: string, ctx: CommandContext): ScriptResult {
  const match = loopStr.match(/for\s+(\w+)\s+from\s+(\d+)\s+to\s+(\d+)\s+\{(.+?)\}/s);

  if (!match) {
    return {
      success: false,
      output: [],
      errors: ['Invalid range for loop syntax. Use: for <var> from <start> to <end> { <commands> }']
    };
  }

  const [, varName, startStr, endStr, commandsStr] = match;
  const start = parseInt(startStr);
  const end = parseInt(endStr);
  const output: string[] = [];
  const errors: string[] = [];

  for (let i = start; i <= end; i++) {
    // Replace variable in commands
    const commands = commandsStr.replace(new RegExp(`\\$${varName}`, 'g'), String(i));
    const commandLines = commands.split('\n').map(line => line.trim()).filter(line => line);

    for (const cmd of commandLines) {
      try {
        const result = executeCommand(cmd, ctx);
        if (result.success) {
          output.push(result.output);
        } else {
          errors.push(result.output);
        }
      } catch (error) {
        errors.push(`Error in loop (${varName}=${i}): ${(error as Error).message}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    output,
    errors
  };
}

// Main script executor that handles all loop types
export function executeAdvancedScript(script: string, ctx: CommandContext): ScriptResult {
  const trimmed = script.trim();

  // Check for foreach loop
  if (trimmed.startsWith('foreach ')) {
    return executeForeachLoop(trimmed, ctx);
  }

  // Check for range-based for loop
  if (/^for\s+\w+\s+from\s+\d+\s+to\s+\d+/.test(trimmed)) {
    return executeRangeForLoop(trimmed, ctx);
  }

  // Check for simple for loop
  if (trimmed.startsWith('for ')) {
    return executeForLoop(trimmed, ctx);
  }

  // Otherwise execute as regular script
  return executeScript(trimmed, ctx);
}
