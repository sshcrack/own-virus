import { Observable } from 'rxjs';

export type Command = BackgroundCommand | ForegroundCommand;

/**
 * Used for commands which do not need user input
 */
export interface BackgroundCommand extends _StructureCommand {
}

/**
 * Used for commands that require user input
 */
export interface ForegroundCommand extends _StructureCommand {
  on_input(input: string): void;
}

interface _StructureCommand {
  /**
   * Name of this command
   */
  name: string,
  /**
   * The help text that should be shown
   */
  help: string,
  /**
   * Ran when the user runs this command
   * @param args The arguments given by the user
   * @returns Observable which determines state of the command and output
   */
  execute(args: string[]): Observable<string[]> | string[]
  /**
   * Used for tab completion
   * @param args The full command, that the user entered
   */
  tab_complete(args: string[]): string[] | void
}