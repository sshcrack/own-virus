import chalk from 'chalk';
import { Global } from '../Global/Global';
import { processCommand } from '../processor/command-process';
import { resetHelpCMDs } from '../tools';

export function OnCommandSubmit() {
  const cmdLine = Global.cmdLine;
  const prefix = Global.prefix;
  const history = Global.historyElement;
  const screen = Global.screen;

  const val = cmdLine.getValue();
  const fullCMD = val.substring(prefix.length)
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



  cmdLine.setValue(prefix);
  cmdLine.focus();

  history.setContent(Global.history.map(e => {
    if (e.command)
      return Global.prefix + chalk.green(e.text)

    return e.text;
  }).join("\n"))

  resetHelpCMDs();
  screen.render();
}