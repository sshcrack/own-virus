import { Notifier } from '../Notifier/Notifier'
import { Updater } from '../Notifier/Updater'
import { ForegroundCommand } from "./basic-command"

export class ShellCommand implements ForegroundCommand {
  name = "shell"
  help = "Open cmd on a remote client"

  updater: Updater<string[]>
  public execute(_args: string[]) {
    return new Notifier<string[]>(observer => {
      observer.update(["Waiting for an input..."])
      setTimeout(() => {
        //observer.update(["2000 ms down"])
      }, 2000)
      this.updater = observer;
    });
  }

  public tab_complete(_str) { }

  public on_input(input: string) {
    this.updater.finish(["Input is " + input])
  }
}