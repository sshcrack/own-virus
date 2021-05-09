import blessed from "blessed";
import chalk from "chalk";
import ws from "ws";
import { Command } from '../commands/basic-command';
import { ExitCommand } from '../commands/exit';
import { HelpCommand } from '../commands/help';
import { ListCommand } from '../commands/list';
import { LoginCommand } from '../commands/login';
import { HistoryInfo } from '../interfaces/historyInfo';
import { UserInput } from '../interfaces/userinput';
import { center } from '../tools';

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
  static standardPrefix = Global.prefix;

  static userInput: UserInput = {
    prefix: Global.prefix,
    input: ""
  }

  static commands: Command[] = [
    new HelpCommand(),
    new ListCommand(),
    new ExitCommand(),
    new LoginCommand()
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