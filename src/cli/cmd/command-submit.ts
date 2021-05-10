import chalk from 'chalk';
import { Global } from '../Global/Global';
import { UserInput } from '../Global/UserInput';
import { processCommand } from '../processor/command-process';
import { debug, renderCMDLine, resetHelpCMDs } from '../tools';

/**
 * Displays command feedback and runs commands
 */
export function OnCommandSubmit() {
  const cmdLine = Global.cmdLine;
  const currPrefix = UserInput.prefix;

  const fullCMD = UserInput.input
  const result = processCommand(fullCMD);
  debug("Full cmd length", fullCMD.length)
  if (fullCMD.length === 0) {
    return;
  }

  const index = Global.history.push({
    command: true,
    text: fullCMD,
    completed: false,
    prefix: currPrefix + ""
  }, {
    command: false,
    text: chalk.yellow("Waiting for command feedback..."),
    prefix: currPrefix + ""
  }) - 1

  result.subscribe(newStat => {
    Global.history[index] = {
      command: false,
      text: newStat,
      prefix: currPrefix + ""
    };
    renderCMDLine();
  })

  result.toPromise().then(() => {
    const entry = Global.history[index]
    if (entry) {
      if (entry.command)
        entry.completed = true;

      Global.history[index] = entry;
    }
    renderCMDLine();
  })



  UserInput.input = ""
  cmdLine.focus();

  resetHelpCMDs();
  renderCMDLine();
}