declare module 'react-console-emulator' {
  import { Component } from 'react';

  interface TerminalCommand {
    description?: string;
    usage?: string;
    fn: (...args: string[]) => string | void;
  }

  interface TerminalProps {
    commands?: Record<string, TerminalCommand>;
    welcomeMessage?: string | string[];
    promptLabel?: string;
    errorMessage?: string;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    inputTextStyle?: React.CSSProperties;
    promptLabelStyle?: React.CSSProperties;
    messageStyle?: React.CSSProperties;
    errorStyle?: React.CSSProperties;
    dangerMode?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    noDefaults?: boolean;
    noAutomaticStdout?: boolean;
    autoFocus?: boolean;
    className?: string;
    ref?: any;
  }

  export default class Terminal extends Component<TerminalProps> {
    pushToStdout: (message: string, type?: 'error' | 'info') => void;
    scrollToBottom: () => void;
  }
}
