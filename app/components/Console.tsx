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

  const commands = {
    bind: {
      description: 'Parse binding syntax',
      usage: 'bind {node}->{port}=>{node}->{port}',
      fn: (...args: string[]) => {
        const cmdStr = `bind ${args.join(' ')}`;
        setCommandHistory(prev => [...prev, cmdStr]);
        const result = executeCommand(cmdStr);
        return result.output;
      }
    }
  };

  const welcomeMessage = [
    '╔══════════════════════════════════════════════════╗',
    '║   IP Instance Explorer Console v1.0              ║',
    '╚══════════════════════════════════════════════════╝',
    '',
    'Type "help" for available commands',
    ''
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border-t border-green-500/30 px-6 py-3 text-sm text-gray-300 hover:text-green-400 hover:border-green-400/50 transition-all duration-200 flex items-center gap-3 shadow-lg shadow-green-500/5"
        title="Open Console (Ctrl+`)"
      >
        <span className="text-green-400 font-bold text-lg">❯</span>
        <span className="font-medium tracking-wide">Console</span>
        {commandHistory.length > 0 && (
          <span className="ml-auto px-2 py-0.5 text-xs text-green-400 bg-green-400/10 rounded-md border border-green-500/20">
            {commandHistory.length} {commandHistory.length === 1 ? 'command' : 'commands'}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-green-500/30 flex flex-col shadow-2xl shadow-green-500/10" style={{ height: '400px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-gray-800 via-gray-800 to-gray-900 border-b border-green-500/20">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-green-400 font-bold text-lg animate-pulse">❯</span>
          <span className="font-semibold text-green-400 tracking-wider">CONSOLE</span>
          {commandHistory.length > 0 && (
            <span className="px-2 py-0.5 text-xs text-green-400 bg-green-400/10 rounded-md border border-green-500/20">
              {commandHistory.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (terminalRef.current) {
                terminalRef.current.clearStdout();
              }
            }}
            className="text-xs px-3 py-1.5 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-md border border-gray-700 hover:border-green-500/30 transition-all duration-200"
            title="Clear console"
          >
            Clear
          </button>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-green-400 transition-colors p-1 hover:bg-green-400/10 rounded"
            title="Close Console (Esc)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            fontWeight: 'bold'
          }}
          inputTextStyle={{
            color: '#f1f5f9',
            fontWeight: '500'
          }}
          errorStyle={{
            color: '#f87171',
            fontWeight: '500'
          }}
        />
      </div>
    </div>
  );
}
