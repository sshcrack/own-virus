import { Global } from '../Global/Global';

/**
 * Used to find the command for tab completion
 */
export function processTabComplete() {
  const cmdLine = Global.cmdLine;
  const prefix = Global.prefix;
  const screen = Global.screen;

  const val = cmdLine.getValue();
  const currCMD = val.substring(prefix.length);

  const currComplete = findTabComplete(Global.beforeTabComplete ?? currCMD, Global.tabOffset);
  if (currCMD !== currComplete)
    Global.beforeTabComplete = currCMD;

  Global.tabOffset++;
  Global.userInput.input = currComplete;
  screen.render();
}

/**
 * Finds the current tab completion for matching commands
 * @param str The user input of which it should find the tab completion
 * @param offset The amount of how many times the user pressed tab
 */
export function findTabComplete(str: string, offset: number) {
  const args = str.split(" ")
  const command = args.shift();
  const commands = Global.commands;

  const matchingCommands = commands.filter(e => e.name.startsWith(command));
  if (matchingCommands.length === 0) return str;

  if (offset >= matchingCommands.length)
    offset -= matchingCommands.length;

  return matchingCommands[offset]?.name ?? str;
}