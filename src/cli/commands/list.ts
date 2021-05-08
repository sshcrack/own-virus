import { center } from '../tools';
import { Command } from "./basic-command"

export class ListCommand implements Command {
  name = "list"
  help = "Get a list of all devices connected"
  public execute(_args: string[]) {

    return [
      center("List of devices")
    ]
  }

  public tab_complete(_str, _offset) { }
}