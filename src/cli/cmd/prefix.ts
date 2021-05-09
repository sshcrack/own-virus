import { Global } from '../Global/Global';

/**
 * Ensures, that the user cant delete the prefix
 */
export function keepPrefix() {
  const prefix = Global.prefix;
  const cmdLine = Global.cmdLine;
  const screen = Global.screen;
  const value = cmdLine.getValue();

  if (value.length < prefix.length) {
    Global.userInput.prefix = Global.prefix;
    Global.userInput.input = ""
    screen.render();
  }
}