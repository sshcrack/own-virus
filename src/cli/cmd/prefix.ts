import { Global } from '../Global/Global';

/**
 * Ensures, that the user cant delete the prefix
 * @returns wether screen should rerender
 */
export function keepPrefix(): boolean {
  const prefix = Global.userInput.prefix;
  const cmdLine = Global.cmdLine;
  const value = cmdLine.getValue();

  if (value.length < prefix.length) {
    Global.userInput.input = ""
    return true;
  }

  return false;
}