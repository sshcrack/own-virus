import { Observable, Subscriber } from 'rxjs'
import { debug, finishObservable } from '../tools/tools'
import { ForegroundCommand } from "./basic-command"

export class ShellCommand implements ForegroundCommand {
  name = "shell"
  help = "Open cmd on a remote client"

  currObserver: Subscriber<string[]>
  public execute(_args: string[]) {
    return new Observable<string[]>(observer => {
      this.currObserver = observer;
    });
  }

  public tab_complete(_str) { }

  public on_input(input) {
    debug("On input");
    finishObservable(["Input is", input], this.currObserver);
  }
}