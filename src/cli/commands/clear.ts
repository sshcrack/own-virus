import { Global } from '../Global/Global'
import { Command } from "./basic-command"

export class ClearCommand implements Command {
  name = "clear"
  help = "Clear the command line"
  public execute(_args: string[]) {

    Global.history = []
    return ["Cleared history"]
  }

  public tab_complete(_str) { }
}