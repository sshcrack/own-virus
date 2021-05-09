export type HistoryInfo = CommandHistoryInterface | NormalHistoryInterface;

/**
 * Is used to determine if a command is finished
 * and which text is has
 */
export interface CommandHistoryInterface {
  command: true,
  completed: boolean,
  text: string,
}

/**
 * Normally used to display user input
 */
export interface NormalHistoryInterface {
  command: false,
  text: string
}