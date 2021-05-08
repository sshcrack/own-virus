import { Global } from '../Global/Global';
import { validateCommand } from '../processor/command-process';
import { getCMDLine } from '../tools';

export function stylizeTerminal() {
  const cmdLine = Global.cmdLine;
  const screen = Global.screen;

  const fullCMD = getCMDLine();

  const prev = cmdLine.style.fg;
  if (validateCommand(fullCMD))
    cmdLine.style.fg = "green"
  else
    cmdLine.style.fg = "yellow"

  if (cmdLine.style.fg !== prev)
    screen.render();
}