import { Observable } from 'rxjs';
import { Command, ForegroundCommand } from '../commands/basic-command';
import { Global } from '../Global/Global';
import { finishObservable } from '../tools/tools';

/**
 * Runs commands and gives their result trough an observable
 * @param fullCmd The command that should be run
 * @returns The command output through an observable
 */
export function processCommand(fullCmd: string) {
  return new Observable<string>(observer => {
    const args = fullCmd.split(" ")
    const command = args.shift();
    const commands = Global.commands;

    const found: Command = commands.find(e => e.name.toLowerCase() === command.toLowerCase());
    const res = found?.execute(args);

    if (res instanceof Observable) {
      const isForeground = Object.keys(found).includes("on_input");
      if (isForeground)
        Global.currCommand = found as ForegroundCommand;

      res.subscribe(data => {
        observer.next(data.join("\n"));
      })

      res.toPromise().then(_e => {
        if (isForeground)
          Global.currCommand = undefined;

        observer.complete();
      })
      return;
    }

    finishObservable(res?.join("\n") ?? Global.notFoundMSG(), observer);
    return
  });



}

export function validateCommand(str: string): boolean {
  const args = str.split(" ")
  const command = args.shift();
  const commands = Global.commands;

  return commands.some(e => e.name.toLowerCase() === command.toLowerCase());
}

