import { BackgroundCommand } from "../interfaces/basic-command"

export default class ExitCommand implements BackgroundCommand {
  name = "exit"
  help = "Exit this command line"
  public execute(_args: string[]) {
    process.exit(0)

    return ["Exiting..."]
  }

  public tab_complete(_str) { }
}