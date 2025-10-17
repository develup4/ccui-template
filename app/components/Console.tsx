'use client';

import { useState, useEffect, useRef } from 'react';
import Terminal from 'react-console-emulator';
import { executeCommand, CommandContext, logGuiAction } from '../lib/console/commandExecutor';
import { executeAdvancedScript } from '../lib/console/scriptExecutor';
import { useExplorer } from '../contexts/ExplorerContext';
import { sampleIPInstanceHierarchy } from '../sample-data';

interface ConsoleProps {
  isOpen: boolean;
  onToggle: () => void;
  reactFlowInstance?: any;
  portVisibility?: Record<string, boolean>;
  setPortVisibility?: (visibility: Record<string, boolean>) => void;
}

export default function Console({
  isOpen,
  onToggle,
  reactFlowInstance,
  portVisibility,
  setPortVisibility
}: ConsoleProps) {
  const terminalRef = useRef<any>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const {
    selectedNode,
    setSelectedNode,
    selectedPort,
    setSelectedPort,
    selectedBinding,
    setSelectedBinding
  } = useExplorer();

  // Setup global logging function for GUI actions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).logConsoleCommand = (command: string) => {
        setCommandHistory(prev => [...prev, command]);
        if (terminalRef.current) {
          terminalRef.current.pushToStdout(`# GUI: ${command}`);
        }
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).logConsoleCommand;
      }
    };
  }, []);

  const commandContext: CommandContext = {
    rootInstance: sampleIPInstanceHierarchy,
    currentInstance: selectedNode,
    currentPort: selectedPort,
    currentBinding: selectedBinding,
    setSelectedNode,
    setSelectedPort,
    setSelectedBinding,
    reactFlowInstance,
    portVisibility,
    setPortVisibility
  };

  const commands = {
    get_instances: {
      description: 'Get list of instances',
      usage: 'get_instances [-hierarchical <pattern>] [-filter {expr}]',
      fn: (...args: string[]) => {
        const result = executeCommand(`get_instances ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    get_instance: {
      description: 'Get specific instance',
      usage: 'get_instance <hierarchy>',
      fn: (...args: string[]) => {
        const result = executeCommand(`get_instance ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    current_instance: {
      description: 'Get or set current instance',
      usage: 'current_instance [<hierarchy>]',
      fn: (...args: string[]) => {
        const result = executeCommand(`current_instance ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    get_property: {
      description: 'Get property value',
      usage: 'get_property <name> <hierarchy>',
      fn: (...args: string[]) => {
        const result = executeCommand(`get_property ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    set_property: {
      description: 'Set property value',
      usage: 'set_property <name> <value> <hierarchy>',
      fn: (...args: string[]) => {
        const result = executeCommand(`set_property ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    list_property: {
      description: 'List all properties',
      usage: 'list_property <hierarchy>',
      fn: (...args: string[]) => {
        const result = executeCommand(`list_property ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    create_binding: {
      description: 'Create binding between ports',
      usage: 'create_binding -from <source> -to <target>',
      fn: (...args: string[]) => {
        const result = executeCommand(`create_binding ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    get_bindings: {
      description: 'Get list of bindings',
      usage: 'get_bindings [-of_objects <hierarchy>] [-from <pattern>]',
      fn: (...args: string[]) => {
        const result = executeCommand(`get_bindings ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    select_objects: {
      description: 'Select object in GUI',
      usage: 'select_objects <hierarchy>',
      fn: (...args: string[]) => {
        const result = executeCommand(`select_objects ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    zoom_to: {
      description: 'Zoom to object in viewport',
      usage: 'zoom_to <hierarchy>',
      fn: (...args: string[]) => {
        const result = executeCommand(`zoom_to ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    show_ports: {
      description: 'Show ports for instance',
      usage: 'show_ports <hierarchy>',
      fn: (...args: string[]) => {
        const result = executeCommand(`show_ports ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    hide_ports: {
      description: 'Hide ports for instance',
      usage: 'hide_ports <hierarchy>',
      fn: (...args: string[]) => {
        const result = executeCommand(`hide_ports ${args.join(' ')}`, commandContext);
        return result.output;
      }
    },
    export_history: {
      description: 'Export command history to file',
      usage: 'export_history',
      fn: () => {
        const script = commandHistory.join('\n');
        const blob = new Blob([script], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'console_history.txt';
        a.click();
        URL.revokeObjectURL(url);
        return 'Command history exported to console_history.txt';
      }
    },
    clear_history: {
      description: 'Clear command history',
      usage: 'clear_history',
      fn: () => {
        setCommandHistory([]);
        return 'Command history cleared';
      }
    },
    run_script: {
      description: 'Run multi-line script with loops',
      usage: 'run_script <script_text>',
      fn: (...args: string[]) => {
        const scriptText = args.join(' ');
        const result = executeAdvancedScript(scriptText, commandContext);

        if (result.success) {
          return result.output.join('\n');
        } else {
          return `Errors:\n${result.errors.join('\n')}\n\nOutput:\n${result.output.join('\n')}`;
        }
      }
    },
    source: {
      description: 'Load and execute script from file (paste content)',
      usage: 'source',
      fn: () => {
        return 'Paste your script below. Supported syntax:\n' +
               '  for <var> in <list> { commands }\n' +
               '  for <var> from <start> to <end> { commands }\n' +
               '  foreach <var> [command] { commands }\n' +
               'Example:\n' +
               '  foreach inst [get_instances root.*] { show_ports $inst }';
      }
    }
  };

  const welcomeMessage = [
    'IP Instance Explorer Console v1.0',
    'Type "help" for available commands',
    ''
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 px-4 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors flex items-center gap-2"
        title="Open Console (Ctrl+`)"
      >
        <span className="text-green-400">❯</span>
        <span>Console</span>
        {commandHistory.length > 0 && (
          <span className="ml-auto text-xs text-gray-500">
            {commandHistory.length} commands in history
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 flex flex-col" style={{ height: '350px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span className="text-green-400">❯</span>
          <span className="font-semibold">Console</span>
          {commandHistory.length > 0 && (
            <span className="text-xs text-gray-500">
              ({commandHistory.length} commands)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const script = commandHistory.join('\n');
              const blob = new Blob([script], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'console_history.txt';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="text-xs px-2 py-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            title="Export history"
          >
            Export
          </button>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            title="Close Console (Esc)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div className="flex-1 overflow-hidden">
        <Terminal
          ref={terminalRef}
          commands={commands}
          welcomeMessage={welcomeMessage}
          promptLabel="❯"
          style={{
            backgroundColor: '#111827',
            minHeight: '100%',
            maxHeight: '100%',
            overflow: 'auto',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}
          messageStyle={{
            color: '#d1d5db'
          }}
          promptLabelStyle={{
            color: '#10b981'
          }}
          inputTextStyle={{
            color: '#f3f4f6'
          }}
          errorStyle={{
            color: '#ef4444'
          }}
        />
      </div>
    </div>
  );
}
