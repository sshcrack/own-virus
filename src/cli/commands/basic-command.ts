import { Observable } from 'rxjs';

/**
 * Is implemented by all terminal commands
 */
export interface Command {
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
   * @param input The full command, that the user entered
   */
  tab_complete(input: string): string[] | void
}