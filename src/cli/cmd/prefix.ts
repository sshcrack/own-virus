import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';


/**
 * Ensures, that the user cant delete the prefix
 * @returns wether screen should rerender
 */
export function keepPrefix(): boolean {
  const prefix = UserInput.prefix;
  const cmdLine = Global.cmdLine;
  const value = cmdLine.getContent();

  if (value.length < prefix.length) {
    UserInput.input = ""
    return true;
  }

  return false;
}