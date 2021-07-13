import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';
import { renderCMDLine } from '../tools/tools';

/**
 * Used to find the command for tab completion
 */
export function processTabComplete() {
  const currCMD = UserInput.input;

  const currComplete = findTabComplete(Global.beforeTabComplete ?? currCMD, Global.tabOffset);
  if (Global.tabOffset === 0)
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
  let cmdOffset = offset;
  let tabOffset = offset;

  const args = str.split(" ")
  const command = args.shift();
  const commands = Global.commands;

  const validCompletion = commands.filter(e => e.name.startsWith(command)).map(e => e.name);
  if (validCompletion.length === 0) return str;

  validCompletion.push(command);

  while (cmdOffset >= validCompletion.length)
    cmdOffset -= validCompletion.length;

  const cmdStr = validCompletion[cmdOffset];
  if (!cmdStr)
    return str;

  const cmd = commands.find(e => e.name === cmdStr);
  if (!cmd)
    return cmdStr;

  if (args.length === 0)
    return cmd?.name;

  const complete = cmd.tab_complete(args)
  if (!complete)
    return str;


  while (tabOffset >= complete.length)
    tabOffset -= complete.length;

  const currComplete = complete[tabOffset];
  if (!currComplete)
    return str;
  return `${command} ${currComplete}`;
}