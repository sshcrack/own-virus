import blessed from "blessed";
import chalk from "chalk";
import ws from "ws";
import { Command } from '../commands/basic-command';
import { ExitCommand } from '../commands/exit';
import { HelpCommand } from '../commands/help';
import { ListCommand } from '../commands/list';
import { ClearCommand } from '../commands/clear';
import { LoginCommand } from '../commands/login';
import { HistoryInfo } from '../interfaces/historyInfo';
import { center } from '../tools';
import { SingleClient } from '../../server/interfaces/user_managing/clients';

export class Global {
  /**
   * All command line widgets
   */

  /**
   * Currently used screen
   */
  static screen: blessed.Widgets.Screen

  /**
   * Command line (input of the user)
   */
  static cmdLine: blessed.Widgets.TextboxElement

  /**
   * The history of commands shown
   */
  static historyElement: blessed.Widgets.Log

  /**
   * Used to get which tab offset
   */
  static tabOffset = 0;

  /**
   * This is the offset of how many times the user pressed arrow up
   */
  static arrowOffset = 0;

  /**
   * The string before tab completion
   */
  static beforeTabComplete: string;

  /**
   * Current history info
   */
  static history: HistoryInfo[] = [];

  /**
   * The websocket the client is connected with
   */
  static socket: ws;

  /**
   * The standard prefix when the console is starting
   */
  static standardPrefix = `${chalk.white(">  ")}`;

  static commands: Command[] = [
    new HelpCommand(),
    new ListCommand(),
    new ExitCommand(),
    new LoginCommand(),
    new ClearCommand()
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


  /**
   * A list of all keys
   */
  static keys = {
    up: "1b5b41",
    down: "1b5b42",
    back: "08"
  }

  static fetchedClients: SingleClient[] = []
}