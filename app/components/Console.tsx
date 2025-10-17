'use client';

import { useState, useEffect, useRef } from 'react';
import Terminal from 'react-console-emulator';
import { executeCommand, CommandContext } from '../lib/console/commandExecutor';
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
    bind: {
      description: 'Create binding between ports',
      usage: 'bind {node}->{port}=>{node}->{port}',
      fn: (...args: string[]) => {
        const result = executeCommand(`bind ${args.join(' ')}`, commandContext);
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
    undo: {
      description: 'Undo last command',
      usage: 'undo',
      fn: (...args: string[]) => {
        const result = executeCommand('undo', commandContext);
        return result.output;
      }
    },
    redo: {
      description: 'Redo last undone command',
      usage: 'redo',
      fn: (...args: string[]) => {
        const result = executeCommand('redo', commandContext);
        return result.output;
      }
    },
    history: {
      description: 'Show command history',
      usage: 'history',
      fn: (...args: string[]) => {
        const result = executeCommand('history', commandContext);
        return result.output;
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
