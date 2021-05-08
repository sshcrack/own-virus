import blessed from "blessed";
import chalk from "chalk";
import { HelpCommand } from '../commands/help';
import { ListCommand } from '../commands/list';
import { TimerCommand } from '../commands/timer';
import { HistoryInfo } from '../interfaces/historyInfo';
import { center } from '../tools';
import ws from "ws"
import { ExitCommand } from '../commands/exit';
import { Command } from '../commands/basic-command';

export class Global {
  static tabOffset = 0;
  static helpOffset = 0;
  static beforeTabComplete: string;
  static history: HistoryInfo[] = [];
  static screen: blessed.Widgets.Screen
  static cmdLine: blessed.Widgets.TextboxElement
  static historyElement: blessed.Widgets.Log
  static socket: ws;

  static prefix = `${chalk.white(">  ")}`
  static commands: Command[] = [
    new HelpCommand(),
    new ListCommand(),
    new ExitCommand(),
    new TimerCommand()
  ]

  static notFoundMSG = () => {
    let lines = [
      chalk`{cyan Command not found}`,
      chalk`{yellow The command} {gray you entered} {red does not exist.}`,
      chalk`{gray Type} {cyan help} {gray to get help}`
    ]


    lines = lines.map(e => center(e))
    return lines.join("\n")
  }


  static keys = {
    up: "1b5b41",
    down: "1b5b42"
  }
}