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

/**
 * Command to create a binding between two ports
 */
export class CreateBindingCommand extends UICommand {
  description: string;
  private instance: IPInstance;
  private binding: any;
  private bindingIndex: number = -1;

  constructor(
    instance: IPInstance,
    binding: any,
    fromStr: string,
    toStr: string
  ) {
    super();
    this.instance = instance;
    this.binding = binding;
    this.description = `bind ${fromStr}=>${toStr}`;
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
