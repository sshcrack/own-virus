import blessed from "blessed";
import chalk from "chalk";
import onChange from "on-change";
import ws from "ws";
import { SingleClient } from '../../server/interfaces/user_managing/clients';
import { Command, ForegroundCommand } from '../interfaces/basic-command';
import { HistoryInfo } from '../interfaces/historyInfo';
import { Notifier } from '../Notifier/Notifier';
import { Updater } from '../Notifier/Updater';
import { center } from '../tools/tools';

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

  static history: HistoryInfo[] = onChange([], () =>
    Global._subscriberHistory.update(Global.history));
  /**
   * Current history info
   */

  static historyEvent = new Notifier<HistoryInfo[]>(e =>
    Global._subscriberHistory = e);


  /**
   * This notifies all subscribed functions
   */
  private static _subscriberHistory: Updater<HistoryInfo[]>;

  /**
   * The websocket the client is connected with
   */
  static socket: ws;

  /**
   * The standard prefix when the console is starting
   */
  static standardPrefix = `${chalk.white(">  ")}`;

  static commands: Command[] = []

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
    back: "08",
    wordBack: "1b08",
    newline: "0d"
  }

  static fetchedClients: SingleClient[] = []

  static currCommand: ForegroundCommand;
}