import { Observable } from 'rxjs';
import { finishObservable } from '../tools';
import { Command } from "./basic-command";

export class TimerCommand implements Command {
  name = "timer"
  help = "Just a test command"
  public execute(_args: string[]) {
    return new Observable<string[]>(observer => {
      observer.next(["Waiting for first time..."])

      setTimeout(() => observer.next(["second timeout"]), 500);
      setTimeout(() => {
        finishObservable(["finished"], observer)
      }, 1000)
    });
  }

  public tab_complete(_str, _offset) { }
}