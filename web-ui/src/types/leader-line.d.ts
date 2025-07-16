// A simplified type declaration for LeaderLine to avoid TypeScript errors.
// This is not exhaustive and can be extended as needed.

declare module 'leader-line' {
  // A basic interface for LeaderLine options.
  // Refer to the official LeaderLine documentation for a full list.
  export interface LeaderLineOptions {
    start?: Element | null
    end?: Element | null
    color?: string
    size?: number
    path?: 'straight' | 'arc' | 'fluid' | 'magnet' | 'grid'
    startSocket?: 'top' | 'right' | 'bottom' | 'left' | 'auto'
    endSocket?: 'top' | 'right' | 'bottom' | 'left' | 'auto'
    startSocketGravity?: number | string | any[]
    endSocketGravity?: number | string | any[]
    startPlug?:
      | 'disc'
      | 'square'
      | 'arrow1'
      | 'arrow2'
      | 'arrow3'
      | 'hand'
      | 'crosshair'
      | 'behind'
    endPlug?:
      | 'disc'
      | 'square'
      | 'arrow1'
      | 'arrow2'
      | 'arrow3'
      | 'hand'
      | 'crosshair'
      | 'behind'
    dash?: boolean | { animation?: boolean; len?: number; gap?: number }
    gradient?: boolean | { startColor?: string; endColor?: string }
    dropShadow?: boolean | { dx?: number; dy?: number; blur?: number; color?: string }
  }

  // The LeaderLine class constructor and main methods.
  export default class LeaderLine {
    constructor(
      start: Element | null,
      end: Element | null,
      options?: LeaderLineOptions,
    )
    constructor(options: LeaderLineOptions)

    // Re-calculates the line's position.
    position(): void

    // Removes the line from the DOM.
    remove(): void

    // Shows the line.
    show(effectName?: string, animOptions?: object): void

    // Hides the line.
    hide(effectName?: string, animOptions?: object): void

    // Other properties that can be get/set
    color: string
    size: number
    // ... add other properties as needed
  }
} 