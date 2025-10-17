import { IPInstance } from '@/app/sample-data';

// ============================================================================
// Command Pattern Base
// ============================================================================

/**
 * Base Command interface for undo/redo pattern
 * All commands must implement execute() and undo()
 */
export interface Command {
  execute(): void;
  undo(): void;
  description: string;
}

/**
 * Abstract base class for commands that need to trigger UI updates
 */
export abstract class UICommand implements Command {
  protected onUpdate?: () => void;

  abstract execute(): void;
  abstract undo(): void;
  abstract description: string;

  setUpdateCallback(callback: () => void): void {
    this.onUpdate = callback;
  }

  protected triggerUpdate(): void {
    if (this.onUpdate) {
      this.onUpdate();
    }
  }
}

// ============================================================================
// Command History Manager
// ============================================================================

class CommandHistoryManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private maxHistorySize: number = 50;

  executeCommand(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = []; // Clear redo stack when new command is executed

    // Limit stack size
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
  }

  undo(): string {
    if (this.undoStack.length === 0) {
      return 'Nothing to undo';
    }

    const command = this.undoStack.pop()!;
    command.undo();
    this.redoStack.push(command);

    return `Undone: ${command.description}`;
  }

  redo(): string {
    if (this.redoStack.length === 0) {
      return 'Nothing to redo';
    }

    const command = this.redoStack.pop()!;
    command.execute();
    this.undoStack.push(command);

    return `Redone: ${command.description}`;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getUndoHistory(): string[] {
    return this.undoStack.map(cmd => cmd.description);
  }

  getRedoHistory(): string[] {
    return this.redoStack.map(cmd => cmd.description);
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

// Global singleton instance
export const commandHistory = new CommandHistoryManager();

// ============================================================================
// Binding Commands
// ============================================================================

// ============================================================================
// Binding Parsing Types
// ============================================================================

export type BindingParsed = {
  fromNode?: string;  // undefined if connecting from parent
  fromPort: string;
  toNode?: string;    // undefined if connecting to parent
  toPort: string;
};

/**
 * Parse bind command format
 * Format: bind {node}->{port}=>{node}->{port}
 * Shorthand: bind {port}=>{node}->{port} (from parent)
 * Shorthand: bind {node}->{port}=>{port} (to parent)
 * Multiple: bind a->p1=>b->p1; b->p2=>p3; c->p4=>a->p1
 */
export function parseBindCommand(bindStr: string): BindingParsed | null {
  const cleaned = bindStr.trim();
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
    toPort = rightSide.trim();
  }

  return { fromNode, fromPort, toNode, toPort };
}

/**
 * Parse multiple bind commands separated by semicolon
 */
export function parseMultipleBindCommands(bindStr: string): BindingParsed[] {
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

/**
 * Command to create a binding between two ports
 */
export class CreateBindingCommand extends UICommand {
  description: string;
  private instance: IPInstance;
  private binding: any;
  private bindingIndex: number = -1;
  private parsed: BindingParsed;

  constructor(
    instance: IPInstance,
    bindStr: string
  ) {
    super();
    this.instance = instance;

    // Parse the binding string
    const parsed = parseBindCommand(bindStr);
    if (!parsed) {
      throw new Error(`Invalid bind format: ${bindStr}`);
    }
    this.parsed = parsed;

    // Create binding object
    const from = parsed.fromNode
      ? `${parsed.fromNode}->${parsed.fromPort}`
      : parsed.fromPort;
    const to = parsed.toNode
      ? `${parsed.toNode}->${parsed.toPort}`
      : parsed.toPort;

    this.binding = { from, to };
    this.description = `bind ${from}=>${to}`;
  }

  execute(): void {
    if (!this.instance.bindings) {
      this.instance.bindings = [];
    }
    this.instance.bindings.push(this.binding);
    this.bindingIndex = this.instance.bindings.length - 1;
    this.triggerUpdate();
  }

  undo(): void {
    if (this.instance.bindings && this.bindingIndex >= 0) {
      this.instance.bindings.splice(this.bindingIndex, 1);
      this.triggerUpdate();
    }
  }

  getBindingInfo(): string {
    const from = this.parsed.fromNode
      ? `${this.parsed.fromNode}->${this.parsed.fromPort}`
      : this.parsed.fromPort;
    const to = this.parsed.toNode
      ? `${this.parsed.toNode}->${this.parsed.toPort}`
      : this.parsed.toPort;
    return `Parsed: ${from} => ${to}`;
  }
}

/**
 * Command to delete a binding
 */
export class DeleteBindingCommand extends UICommand {
  description: string;
  private instance: IPInstance;
  private binding: any;
  private bindingIndex: number;

  constructor(instance: IPInstance, binding: any, index: number) {
    super();
    this.instance = instance;
    this.binding = binding;
    this.bindingIndex = index;
    this.description = `delete binding ${binding.from}=>${binding.to}`;
  }

  execute(): void {
    if (this.instance.bindings && this.bindingIndex >= 0) {
      this.instance.bindings.splice(this.bindingIndex, 1);
      this.triggerUpdate();
    }
  }

  undo(): void {
    if (!this.instance.bindings) {
      this.instance.bindings = [];
    }
    this.instance.bindings.splice(this.bindingIndex, 0, this.binding);
    this.triggerUpdate();
  }
}

// ============================================================================
// Property Commands (for future use)
// ============================================================================

/**
 * Command to set a property value
 */
export class SetPropertyCommand extends UICommand {
  description: string;
  private instance: IPInstance;
  private propertyName: string;
  private newValue: any;
  private oldValue: any;

  constructor(instance: IPInstance, propertyName: string, newValue: any) {
    super();
    this.instance = instance;
    this.propertyName = propertyName;
    this.newValue = newValue;
    this.oldValue = instance.data?.properties?.[propertyName];
    this.description = `set ${propertyName}=${newValue}`;
  }

  execute(): void {
    if (!this.instance.data) {
      this.instance.data = { properties: {} };
    }
    if (!this.instance.data.properties) {
      this.instance.data.properties = {};
    }
    this.instance.data.properties[this.propertyName] = this.newValue;
    this.triggerUpdate();
  }

  undo(): void {
    if (this.instance.data?.properties) {
      if (this.oldValue === undefined) {
        delete this.instance.data.properties[this.propertyName];
      } else {
        this.instance.data.properties[this.propertyName] = this.oldValue;
      }
      this.triggerUpdate();
    }
  }
}

// Export functions for GUI usage
export function undoLastCommand(): string {
  return commandHistory.undo();
}

export function redoLastCommand(): string {
  return commandHistory.redo();
}

export function canUndo(): boolean {
  return commandHistory.canUndo();
}

export function canRedo(): boolean {
  return commandHistory.canRedo();
}

export function clearHistory(): void {
  commandHistory.clear();
}
