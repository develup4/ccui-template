'use client';

import { useRef } from 'react';
import Terminal from 'react-console-emulator';
import { commandHistory } from '../lib/console/commandHistory';
import { executeCommand } from '../lib/console/commandExecutor';

interface ConsoleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Console({ isOpen, onToggle }: ConsoleProps) {
  const terminalRef = useRef<any>(null);

  const commands = {
    bind: {
      description: 'Create port binding',
      usage: 'bind {node}->{port}=>{node}->{port}',
      fn: (...args: string[]) => {
        const result = executeCommand(`bind ${args.join(' ')}`);
        return result.output;
      }
    },
    help: {
      description: 'Show available commands',
      usage: 'help',
      fn: () => {
        const result = executeCommand('help');
        return result.output;
      }
    },
    clear: {
      description: 'Clear console output',
      usage: 'clear',
      fn: () => {
        if (terminalRef.current) {
          terminalRef.current.clearStdout();
        }
        return '';
      }
    },
    undo: {
      description: 'Undo last command',
      usage: 'undo',
      fn: () => {
        return commandHistory.undo();
      }
    },
    redo: {
      description: 'Redo last undone command',
      usage: 'redo',
      fn: () => {
        return commandHistory.redo();
      }
    },
    history: {
      description: 'Show command history',
      usage: 'history',
      fn: () => {
        const undoHistory = commandHistory.getUndoHistory();
        const redoHistory = commandHistory.getRedoHistory();

        let output = 'Command History:\n';
        if (undoHistory.length > 0) {
          output += '\nUndo Stack:\n' + undoHistory.map((cmd, i) => `  ${i + 1}. ${cmd}`).join('\n');
        }
        if (redoHistory.length > 0) {
          output += '\n\nRedo Stack:\n' + redoHistory.map((cmd, i) => `  ${i + 1}. ${cmd}`).join('\n');
        }
        if (undoHistory.length === 0 && redoHistory.length === 0) {
          output += '\n  (empty)';
        }

        return output;
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

  const historyCount = commandHistory.getUndoHistory().length;

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
          {historyCount > 0 && (
            <span className="px-2 py-0.5 text-xs text-green-400 bg-green-400/10 rounded-md border border-green-500/20">
              {historyCount}
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
