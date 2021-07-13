/**
 * A Interface, which contains information about the user input and the prefix that is currently used
 */
export interface UserInput {
  /**
   * The prefix that should be used
   * @example prefix = "  >"
   */
  prefix: string,

  /**
   * The input the user does
   * @example input = "help"
   */
  input: string
}