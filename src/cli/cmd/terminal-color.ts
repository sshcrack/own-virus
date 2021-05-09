import { Global } from '../Global/Global';
import { validateCommand } from '../processor/command-process';

/**
 * Sets the style green, if the command is valid
 * Red if not
 */
export function stylizeTerminal(): boolean {
  const cmdLine = Global.cmdLine;

  const fullCMD = Global.userInput.input;

  const prev = cmdLine.style.fg;
  if (validateCommand(fullCMD))
    cmdLine.style.fg = "green"
  else
    cmdLine.style.fg = "yellow"

  if (cmdLine.style.fg !== prev)
    return true
  return false
}