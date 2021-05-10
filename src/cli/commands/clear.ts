import { Global } from '../Global/Global'
import { BackgroundCommand } from "./basic-command"

export class ClearCommand implements BackgroundCommand {
  name = "clear"
  help = "Clear the command line"
  public execute(_args: string[]) {

    Global.history = []
    return ["Cleared history"]
  }

  public tab_complete(_str) { }
}