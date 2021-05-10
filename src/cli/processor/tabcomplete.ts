import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';
import { renderCMDLine } from '../tools/tools';

/**
 * Used to find the command for tab completion
 */
export function processTabComplete() {
  const currCMD = UserInput.input;

  const currComplete = findTabComplete(Global.beforeTabComplete ?? currCMD, Global.tabOffset);
  if (currCMD !== currComplete)
    Global.beforeTabComplete = currCMD;

  Global.tabOffset++;
  UserInput.input = currComplete;
  renderCMDLine();
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

  const cmd = matchingCommands[offset];
  if (!cmd)
    return str;

  if (args.length === 0)
    return cmd?.name;

  const complete = cmd.tab_complete(args)
  if (!complete)
    return str;


  if (offset >= complete.length)
    offset -= complete.length;

  return `${command} ${complete[offset]}`;
}