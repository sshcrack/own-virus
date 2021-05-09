import chalk from 'chalk';
import { Global } from '../Global/Global';
import { processCommand } from '../processor/command-process';
import { resetHelpCMDs } from '../tools';

/**
 * Displays command feedback and runs commands
 */
export function OnCommandSubmit() {
  const cmdLine = Global.cmdLine;
  const screen = Global.screen;

  const fullCMD = Global.userInput.input
  const result = processCommand(fullCMD);

  const index = Global.history.push({
    command: true,
    text: fullCMD,
    completed: false
  }, {
    command: false,
    text: chalk.yellow("Waiting for command feedback...")
  }) - 1

  result.subscribe(newStat => {
    Global.history[index] = {
      command: false,
      text: newStat
    };
    screen.render();
  })

  result.toPromise().then(() => {
    const entry = Global.history[index]
    if (entry.command)
      entry.completed = true;

    Global.history[index] = entry;
    screen.render();
  })



  Global.userInput.input = ""
  cmdLine.focus();

  resetHelpCMDs();
  screen.render();
}