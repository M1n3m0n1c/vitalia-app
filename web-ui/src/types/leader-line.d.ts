declare module 'leader-line' {
  interface LeaderLineOptions {
    color?: string;
    size?: number;
    startSocket?: string;
    endSocket?: string;
    [key: string]: any;
  }

  class LeaderLine {
    constructor(start: HTMLElement, end: HTMLElement, options?: LeaderLineOptions);
    remove(): void;
    position(): void;
  }

  export = LeaderLine;
} 