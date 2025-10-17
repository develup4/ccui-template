'use client';

import { useState, useRef } from 'react';
import Terminal from 'react-console-emulator';
import { executeCommand } from '../lib/console/commandExecutor';

interface ConsoleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Console({ isOpen, onToggle }: ConsoleProps) {
  const terminalRef = useRef<any>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // Generic command handler that routes all commands through executeCommand
  const createCommandHandler = (cmdName: string) => {
    return {
      description: getCommandDescription(cmdName),
      usage: getCommandUsage(cmdName),
      fn: (...args: string[]) => {
        const cmdStr = args.length > 0 ? `${cmdName} ${args.join(' ')}` : cmdName;
        setCommandHistory(prev => [...prev, cmdStr]);

        // Handle clear command specially to actually clear the terminal
        if (cmdName === 'clear' && terminalRef.current) {
          terminalRef.current.clearStdout();
          return '';
        }

        const result = executeCommand(cmdStr);
        return result.output;
      }
    };
  };

  const commands = {
    help: createCommandHandler('help'),
    clear: createCommandHandler('clear'),
    bind: createCommandHandler('bind'),
  };

  function getCommandDescription(cmdName: string): string {
    switch (cmdName) {
      case 'help': return 'Show available commands';
      case 'clear': return 'Clear console output';
      case 'bind': return 'Create port binding';
      default: return '';
    }
  }

  function getCommandUsage(cmdName: string): string {
    switch (cmdName) {
      case 'help': return 'help';
      case 'clear': return 'clear';
      case 'bind': return 'bind {node}->{port}=>{node}->{port}';
      default: return cmdName;
    }
  }

  const welcomeMessage = [
    '╔══════════════════════════════════════════════════╗',
    '║   IP Instance Explorer Console v1.0              ║',
    '╚══════════════════════════════════════════════════╝',
    '',
    'Type "help" for available commands',
    ''
  ];

  return (
    <div className={`bg-gray-900 border-t border-green-500/30 flex flex-col shadow-2xl shadow-green-500/10 transition-all duration-300 ${
      isOpen ? 'h-[400px]' : 'h-auto'
    }`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className={`flex items-center justify-between px-6 py-3 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 text-sm text-gray-300 hover:text-green-400 transition-all duration-200 ${
          isOpen ? 'border-b border-green-500/20' : 'border-green-500/30 hover:border-green-400/50'
        }`}
        title={isOpen ? "Close Console (Esc)" : "Open Console (Ctrl+`)"}
      >
        <div className="flex items-center gap-3">
          <span className={`text-green-400 font-bold text-lg ${isOpen ? 'animate-pulse' : ''}`}>❯</span>
          <span className="font-medium tracking-wide">{isOpen ? 'CONSOLE' : 'Console'}</span>
          {commandHistory.length > 0 && (
            <span className="px-2 py-0.5 text-xs text-green-400 bg-green-400/10 rounded-md border border-green-500/20">
              {commandHistory.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Terminal */}
      {isOpen && (
        <div className="flex-1 overflow-hidden [&_.react-console-emulator__prompt]:align-baseline [&_.react-console-emulator__prompt]:inline-block [&_.react-console-emulator__content_input]:align-baseline [&_.react-console-emulator__content_input]:inline">
          <Terminal
            ref={terminalRef}
            commands={commands}
            welcomeMessage={welcomeMessage}
            promptLabel="❯"
            style={{
              backgroundColor: '#0f172a',
              minHeight: '100%',
              maxHeight: '100%',
              overflow: 'auto',
              fontFamily: '"Fira Code", "Courier New", monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              padding: '16px'
            }}
            messageStyle={{
              color: '#cbd5e1'
            }}
            promptLabelStyle={{
              color: '#10b981',
              fontWeight: 'bold',
              display: 'inline-block',
              verticalAlign: 'middle',
              lineHeight: '1.6'
            }}
            inputTextStyle={{
              color: '#f1f5f9',
              fontWeight: '500',
              verticalAlign: 'middle',
              lineHeight: '1.6'
            }}
            errorStyle={{
              color: '#f87171',
              fontWeight: '500'
            }}
          />
        </div>
      )}
    </div>
  );
}
