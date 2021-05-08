import chalk from 'chalk';
import { Global } from '../Global/Global';
import { center } from '../tools';
import { Command } from "./basic-command"

export class HelpCommand implements Command {
  name = "help"
  help = "The command you are using"
  public execute(_args: string[]) {
    const commands = Global.commands;

    const helpCommands = commands
      .map(e => chalk`{green ${e.name}} - {yellow ${e.help}}`)
      .map(e => center(e));

    return [
      center(chalk`{cyan Help of all commands}`),
      "",
      ...helpCommands
    ]
  }

  public tab_complete(_str, _offset) { }
}