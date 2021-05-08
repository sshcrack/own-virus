import { Global } from '../Global/Global';

export function processTabComplete() {
  const cmdLine = Global.cmdLine;
  const prefix = Global.prefix;
  const screen = Global.screen;

  const val = cmdLine.getValue();
  const currCMD = val.substring(prefix.length);

  const currComplete = tabComplete(Global.beforeTabComplete ?? currCMD, Global.tabOffset);
  if (currCMD !== currComplete)
    Global.beforeTabComplete = currCMD;

  Global.tabOffset++;
  cmdLine.setValue(prefix + currComplete);
  screen.render();
}

export function tabComplete(str: string, offset: number) {
  const args = str.split(" ")
  const command = args.shift();
  const commands = Global.commands;

  const matchingCommands = commands.filter(e => e.name.startsWith(command));
  if (matchingCommands.length === 0) return str;

  if (offset >= matchingCommands.length)
    offset -= matchingCommands.length;

  return matchingCommands[offset]?.name ?? str;
}